import express from 'express';
import { healthCheck } from '../controllers/healthCheckController.js';

const router = express.Router();

router.get('/healthcheck', healthCheck);

export default router;