import "./loadEnv.js";
import express from 'express';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import authRoutes from './routes/authRoutes.js'
import expensesRoutes from './routes/expensesRoutes.js';
import healthCheckRoutes from './routes/healthCheckRoutes.js';
import { getErrorMessage } from './utils/error.js';

const SERVER_PORT = Number(process.env.SERVER_PORT) || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/', healthCheckRoutes);

async function main() {
    console.log(`Postgres host port: ${process.env.POSTGRES_HOST_PORT}`);
    try {
        app.listen(SERVER_PORT, () => {
            console.log(`Server running at http://localhost:${SERVER_PORT}`);
            console.log(`Swagger docs availabe at http://localhost:${SERVER_PORT}/docs`);
        });
    }
    catch (error) {
        console.error("Failed to start server: ", getErrorMessage(error));
    }
}

main();