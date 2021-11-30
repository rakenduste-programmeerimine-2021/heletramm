import cors from 'cors';
import express, {Request, Response} from 'express';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import friendRoutes from './routes/friendRoutes';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();


export const expressApp = express();
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