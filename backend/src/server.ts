import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'

const SERVER_PORT = Number(process.env.SERVER_PORT) || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

async function main() {
    try {
        console.log("Connected to postgres server at port 5433");

        app.listen(SERVER_PORT, ()=>{
            console.log(`Server running at http://localhost:${SERVER_PORT}`);
        });
    }
    catch (error) {

    }
}

main();