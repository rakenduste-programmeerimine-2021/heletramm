import cors from 'cors';
import express, {Request, Response} from 'express';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import friendRoutes from './routes/friendRoutes';
import cookieParser from 'cookie-parser';
import {AuthErrorHandler} from './error_handling/authErrors';
import dotenv from 'dotenv';
import { FriendErrorHandler } from './error_handling/friendErrors';
dotenv.config();

const corsOptions={
    origin: "http://localhost:3000",
    credentials: true,
    optionSuccessStatus: 200
}


export const expressApp = express();
expressApp.use(cors(corsOptions));
expressApp.use(express.json());
expressApp.use(cookieParser());
expressApp.use(authRoutes);
expressApp.use(chatRoutes);
expressApp.use('/friend', friendRoutes);
expressApp.use(AuthErrorHandler);
expressApp.use(FriendErrorHandler);

expressApp.get('/', (req: Request, res: Response) => {
    res.send("This is the default path");
})

expressApp.get('*', (req: Request, res: Response) => {
    res.send("This path doesn't exist");
})