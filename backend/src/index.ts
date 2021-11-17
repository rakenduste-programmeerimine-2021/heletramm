import 'reflect-metadata';
import express from 'express';
import {createConnection} from 'typeorm';
import authRoutes from './routes/authRoutes';
import cookieParser from 'cookie-parser';
import { refreshTokenRoute } from './routes/refreshTokenRoute';


const app = express();
const PORT = 3001 || process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);

app.get('/', (req, res) => {
    res.send("This is the default path");
})

app.get('/refresh_token', refreshTokenRoute);


const startServer = async () => {

    await createConnection();
    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    })
}


startServer();