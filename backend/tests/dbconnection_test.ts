import {serverSetup} from '../src/index';
import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import { createConnection } from 'typeorm';
import {Express} from 'express';

chai.use(chaiHttp);

const testAccount = {
    nickname: "testuser",
    email: "test@test1234.ee",
    password: "test1234!"
}

let app: Express;

before((done) => {
    createConnection({
        type: "postgres",
        host: "pgdb",
        port: 5432,
        username: "postgres",
        password: "root",
        database: "heletrammdb",
        synchronize: true,
        entities: ["src/model/*.ts"]
    }).then((connection) => {
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

describe("Authentication testing", () => {
    it('Can create account', (done) => {
        chai.request("http://localhost:3002")
        .post('/register')
        .send({
            nickname: "testuser",
            email: "test@test1234.ee",
            password: "test1234!"
        })
        .end((err, res) => {
            expect(res).to.have.status(200);
            done();
        })
    })
})