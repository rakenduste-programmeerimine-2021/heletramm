import {serverSetup} from '../src/index';
import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
//   <<<<<<< apitestsetup
//   import { createConnection } from 'typeorm';
//   import {Express} from 'express';

//   chai.use(chaiHttp);

//   const testAccount = {
//       nickname: "testuser",
//       email: "test@test1234.ee",
//       password: "test1234!"
//   }

//   let app: Express;
//   =======
import {createConnection, Repository} from 'typeorm';
import {Express} from 'express';
import { User } from '../src/model/User';


chai.use(chaiHttp);

const testAccount = new User();
testAccount.nickname =  "testuser";
testAccount.email = "test@test1234.ee";
testAccount.password = "test1234!";

let app: Express;
let userRepository: Repository<User>

before((done) => {
    createConnection({
        type: "postgres",
        host: "pgdb",
        port: 5432,
        username: "postgres",
        password: "root",
//         database: "heletrammdb",
//         synchronize: true,
//         entities: ["src/model/*.ts"]
//     }).then((connection) => {
        database: "heletrammtestdb",
        synchronize: true,
        entities: ["src/model/*.ts"]
    }).then((connection) => {
        userRepository = connection.getRepository(User);
        console.log("Successfully connected to test db");
        app = serverSetup();
        done();
    });
})

describe("Testing if server works", () => {
    it('server is live', (done) => {
        chai.request("http://localhost:3002").get('/').end((err, res) => {
            expect(res.text).to.equal('This is the default path');
            done();
        })
    })
})

// describe("Authentication testing", () => {
//     it('Can create account', (done) => {
//         chai.request("http://localhost:3002")
//         .post('/register')
//         .send({
//             nickname: "testuser",
describe('Registration test', () => {
    before((done) => {
        userRepository.clear().then(() => {
            done();
        })
    })

    it('Can register', (done) => {
        chai.request("http://localhost:3002")
        .post('/register')
        .send({
            nickname: testAccount.nickname,
            email: testAccount.email,
            password: testAccount.password
        })
        .end((err, res) => {
            expect(res).to.have.status(200);
            done();
        })
    })
    
    const agent = chai.request.agent("http://localhost:3002");

    it('Login', (done) => {
        agent.post('/login')
        .send({
            email: "test@test1234.ee",
            password: "test1234!"
        })
        .end((err, res) => {

            expect(res).to.have.cookie('jid');
            expect(res.body.token).to.not.be.null;
            expect(res).to.have.status(200);
            done();
        })
    })

    it('Refresh_token', (done) => {
        agent.get('/refresh_token').end((err, res) => {
            console.log(res);
            expect(res.body.success).to.be.true;
            done();
        })
    })

    after((done) => {
        agent.close();
        done()
    })
})
