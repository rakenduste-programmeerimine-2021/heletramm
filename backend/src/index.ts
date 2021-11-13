import 'reflect-metadata';
import express from 'express';
import {createConnection} from 'typeorm';
import authRoutes from './routes/authRoutes';


const app = express();
const PORT = 3000 || process.env.PORT;

app.use(express.json());

app.use(authRoutes);

app.get('/', (req, res) => {
    res.send("This is the default path");
})


const startServer = async () => {

    await createConnection();
    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    })
}


startServer();