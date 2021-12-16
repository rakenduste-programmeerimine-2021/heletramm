import 'reflect-metadata';
import {createConnection, ConnectionOptions} from 'typeorm';
import http from 'http';
import {Server} from 'socket.io';
import { userHandler } from './routes/socketRoutes';
import { socketAuthMiddleware } from './middleware/authorization';
import {expressApp} from './app';

const dbConnection: ConnectionOptions = {
    "type": "postgres",
    "host": "pgdb",
    "port": 5432,
    "username": "postgres",
    "password": "root",
    "database": "heletrammdb",
    "synchronize": true,
    "entities": ["src/model/*.ts"],
};


const startServer = async () => {

    await createConnection(dbConnection);
    const app = http.createServer(expressApp);

    const io = new Server(app, {
        cors: {
            origin: `http://${process.env.SERVER_URL}:3000`,
            methods: ["GET", "POST"],
            credentials: true

        }
    });

    io.use(socketAuthMiddleware);
    io.on('connection', userHandler);

    app.listen(3001, () => {
        console.log(`Listening on port: ${3001}`);
    })
}



startServer();