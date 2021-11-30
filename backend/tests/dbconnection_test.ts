import {expressApp} from '../src/app';
import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {ConnectionOptions, createConnection, getConnection, Repository} from 'typeorm';
import { User } from '../src/model/User';
import http from 'http';



chai.use(chaiHttp);

const testAccount = new User();
testAccount.nickname =  "testuser";
testAccount.email = "test@test1234.ee";
testAccount.password = "test1234!";


const testDbConnection: ConnectionOptions = {
    "type": "postgres",
    "host": "pgdb",
    "port": 5432,
    "username": "postgres",
    "password": "root",
    "database": "heletrammtestdb",
    "dropSchema": true,
    "synchronize": true,
    "entities": ["src/model/*.ts"],
}

let userRepository: Repository<User>;
const app = expressApp;
let server: http.Server;


before(() => {
    it('Server setup', async () => {
        await createConnection(testDbConnection);
        server = app.listen(3002, () => {
            console.log("Test server running");
        });
        userRepository = getConnection().getRepository(User);

    }).timeout(5000);
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

    it('Logout', async () => {
        const response = await agent.get('/logout').send()
        expect(response).to.not.have.cookie('jid');
    })

    after((done) => {
        agent.close();
        done()
    })
})
