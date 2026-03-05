import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { prisma } from './lib/prisma.js';

const SERVER_PORT = Number(process.env.SERVER_PORT) || 3000;

const app = express();
app.use(cors());
app.use(express.json());

async function main() {
    try {
        console.log("Connected to postgres server at port 5433");

        app.get("/", (req, res)=>{res.json({"txt": "ok"})})

        app.listen(SERVER_PORT, ()=>{
            console.log(`Server running at http://localhost:${SERVER_PORT}`);
        });
    }
    catch (error) {

    }
}

main();