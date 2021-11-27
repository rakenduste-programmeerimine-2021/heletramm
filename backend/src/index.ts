import 'reflect-metadata';
import express, { Response, Request } from 'express';
import {createConnection} from 'typeorm';
import authRoutes from './routes/authRoutes';
import friendRoutes from './routes/friendRoutes';
import chatRoutes from './routes/chatRoutes';
import cookieParser from 'cookie-parser';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import { userHandler } from './routes/socketRoutes';
import { socketAuthMiddleware } from './middleware/authorization';

//const PORT = 3001 || process.env.PORT;
const PORT = require.main === module ? 3001 : 3002;

export const serverSetup = () => {
    const expressApp = express();
    expressApp.use(cors());
    expressApp.use(express.json());
    expressApp.use(cookieParser());
    expressApp.use(authRoutes);
    expressApp.use(chatRoutes);
    expressApp.use('/friend', friendRoutes);
    expressApp.get('/', (req: Request, res: Response) => {
        res.send("This is the default path");
    })

    expressApp.get('*', (req: Request, res: Response) => {
        res.send("This path doesn't exist");
    })

    const app = http.createServer(expressApp);
    const io = new Server(app, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true

        }
    });

    return {app, io};
}


const startServer = async () => {

    const {app, io} = serverSetup();
    await createConnection();

    io.use(socketAuthMiddleware);
    io.on('connection', userHandler);

    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    })
}



startServer();