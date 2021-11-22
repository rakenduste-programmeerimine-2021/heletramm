import {serverSetup} from '../src/index';
import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {createConnection, Repository} from 'typeorm';
import { User } from '../src/model/User';
import http from 'http';


chai.use(chaiHttp);

const testAccount = new User();
testAccount.nickname =  "testuser";
testAccount.email = "test@test1234.ee";
testAccount.password = "test1234!";


let app: http.Server;
let userRepository: Repository<User>

before((done) => {
    createConnection({
        type: "postgres",
        host: "pgdb",
        port: 5432,
        username: "postgres",
        password: "root",
        database: "heletrammtestdb",
        synchronize: true,
        entities: ["src/model/*.ts"]
    }).then((connection) => {
        userRepository = connection.getRepository(User);
        console.log("Successfully connected to test db");
        ({app} = serverSetup());
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

describe('Registration test', () => {
    before((done) => {
        userRepository.delete({email: testAccount.email})
        .then((res) => {
            done();
        })
        .catch((err) => {throw new Error(err)})
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
            if (err) throw Error(err);
            expect(res).to.have.status(200);
            done();
        })
    })
    
    const agent = chai.request.agent("http://localhost:3002");

    it('Login', (done) => {
        agent.post('/login')
        .send({
            email: testAccount.email,
            password: testAccount.password
        })
        .end((err, res) => {
            if (err) throw Error(err);

            expect(res).to.have.cookie('jid');
            expect(res.body.token).to.not.be.null;
            expect(res).to.have.status(200);
            done();
        })
    })

    it('Refresh_token', (done) => {
        agent.get('/refresh_token').end((err, res) => {
            if (err) throw Error(err);

            expect(res.body.success).to.be.true;
            done();
        })
    })

    after((done) => {
        agent.close();
        done()
    })
})