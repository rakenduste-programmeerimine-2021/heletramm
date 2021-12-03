import { User } from "../src/model/User";
import {Room} from '../src/model/Room';
import { expect } from "chai";
import { Connection, getConnection, Repository } from "typeorm";
import chai from 'chai';
import { Friend } from "../src/model/Friend";

const testAccount = new User();
testAccount.nickname = "testuser1";
testAccount.email = "testuser1@test.ee";
testAccount.password = "test1234!";

const testAccount2 = new User();
testAccount2.nickname = "testuser2";
testAccount2.email = "testuser2@test.ee";
testAccount2.password = "test1234!";

let accessToken = "";

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
            nickname: testAccount.nickname,
            email: testAccount.email,
            password: testAccount.password
        })

        await chai.request("http://localhost:3002")
        .post('/register')
        .send({
            nickname: testAccount2.nickname,
            email: testAccount2.email,
            password: testAccount2.password
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
})