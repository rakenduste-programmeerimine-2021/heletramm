import 'reflect-metadata';
import express, { Response, Request } from 'express';
import {createConnection} from 'typeorm';
import authRoutes from './routes/authRoutes';
import cookieParser from 'cookie-parser';

//const PORT = 3001 || process.env.PORT;
const PORT = require.main === module ? 3001 : 3002;

export const serverSetup = () => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    app.use(authRoutes);

    app.get('/', (req: Request, res: Response) => {
        res.send("This is the default path");
    })

    app.get('*', (req: Request, res: Response) => {
        res.send("This path doesn't exist");
    })

    return app;
}


const startServer = async () => {

    const app = serverSetup();
    await createConnection();
    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    })
}



startServer();