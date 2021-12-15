import { User } from "../src/model/User";
import {Room, RoomType} from '../src/model/Room';
import { expect } from "chai";
import { Connection, getConnection, Repository } from "typeorm";
import chai from 'chai';
import { Friend } from "../src/model/Friend";

const testAccount = new User();
testAccount.username = "testuser1";
testAccount.email = "testuser1@test.ee";
testAccount.password = "test1234!";

const testAccount2 = new User();
testAccount2.username = "testuser2";
testAccount2.email = "testuser2@test.ee";
testAccount2.password = "test1234!";

const testAccount3 = new User();
testAccount3.username = "testuser3";
testAccount3.email = "testuser3@test.ee";
testAccount3.password = "test1234!";

let accessToken = "";
let group_connect_id = 0;

let connection: Connection;
let userRepository: Repository<User>;
let roomRepository: Repository<Room>;
let friendRepository: Repository<Friend>;




describe("Friends", () => {
    before(async () => {

        connection = getConnection();
        userRepository = connection.getRepository(User);
        roomRepository = connection.getRepository(Room);
        friendRepository = connection.getRepository(Friend);

        /*
        [testAccount, testAccount2].forEach(async (user) => {
            await userRepository.delete({email: user.email});
        })
        */

        await chai.request('http://localhost:3002')
        .post('/register')
        .send({
            username: testAccount.username,
            email: testAccount.email,
            password: testAccount.password
        })

        await chai.request("http://localhost:3002")
        .post('/register')
        .send({
            username: testAccount2.username,
            email: testAccount2.email,
            password: testAccount2.password
        })

        await chai.request("http://localhost:3002")
        .post('/register')
        .send({
            username: testAccount3.username,
            email: testAccount3.email,
            password: testAccount3.password
        })

        const response = await chai.request('http://localhost:3002')
        .post('/login')
        .send({
            email: testAccount.email,
            password: testAccount.password
        })
        if (!response.body.token) throw new Error('Couldnt get token');
        accessToken = response.body.token;

    })

    it('Add friends', async () => {
        const friendToAdd = await userRepository.findOne({email: testAccount2.email});

        const response = await chai.request('http://localhost:3002')
        .post('/friend/add')
        .auth(accessToken, {type: 'bearer'})
        .send({
            friend_id: friendToAdd.id
        })
        expect(response.body.message).to.equal('Friend added successfully');
    })

    it('Cant add the same friend twice', async () => {
        const friendToAdd = await userRepository.findOne({email: testAccount2.email});

        const response = await chai.request('http://localhost:3002')
        .post('/friend/add')
        .auth(accessToken, {type: 'bearer'})
        .send({
            friend_id: friendToAdd.id
        })
        expect(response.body.errors).to.not.be.null;
    })

    it('Cant add a person who doesnt exist', async () => {
        const response = await chai.request('http://localhost:3002')
        .post('/friend/add')
        .auth(accessToken, {type: 'bearer'})
        .send({
            friend_id: 9999
        })
        expect(response.body.errors).to.not.be.null;
    })

    it('Can find users to add', async () => {
        const response = await chai.request('http://localhost:3002')
        .get('/friend/find')
        .auth(accessToken, {type: 'bearer'})
        .send({
            username: "test"
        })

        expect(response.body).length.to.be.greaterThan(0)
        expect(response.body[1]).to.have.property('username', "testuser1")
    })

    it('NoUsersFound error', async () => {
        const response = await chai.request('http://localhost:3002')
        .get('/friend/find')
        .auth(accessToken, {type: 'bearer'})
        .send({
            username: "999"
        })

        expect(response.body.errors).to.not.be.length(0)
    })


    it('Friend list API', async () => {
        const response = await chai.request('http://localhost:3002')
        .get('/friend/me')
        .auth(accessToken, {type: "bearer"})
        .send()

        expect(response.body.friends).to.not.be.undefined;
    })

    it('Room creation', async () => {
        const user = await userRepository.findOne({email: testAccount2.email});

        const response = await chai.request('http://localhost:3002')
        .post('/connect')
        .auth(accessToken, {type: "bearer"})
        .send({
            friend_id: user.id,
            room_type: "private"
        })

        expect(response).to.be.status(200);
    })

    it('Group creation', async () => {
        const users = await Promise.all([testAccount2, testAccount3].map(async (user) => {
           return await userRepository.findOne({username: user.username});
        }));

        const response = await chai.request('http://localhost:3002')
        .post('/group/create')
        .auth(accessToken, {type: 'bearer'})
        .send({
            user_ids: users.map((user) => user.id)
        });

        expect(response).to.be.status(200);
    })

    it('My groups', async () => {
        const response = await chai.request('http://localhost:3002')
        .get('/group/me')
        .auth(accessToken, {type: 'bearer'})
        .send();

        expect(response).to.be.status(200);
        expect(response.body.rooms).to.be.length.gte(0);

        const groups = response.body.rooms as Room[];
        group_connect_id = groups[0].id;

    })

    it('Connecting to group chat', async () => {
        const response = await chai.request('http://localhost:3002')
        .post('/connect')
        .auth(accessToken, {type: 'bearer'})
        .send({
            room_type: RoomType.GROUP,
            room_id: group_connect_id
        })

        expect(response).to.be.status(200);
        expect(response.body).to.not.be.undefined;
        expect(response.body).to.haveOwnProperty('group_name');
    })

})
