import express from 'express';
import {
    register,
    login,
    changePassword,
    deleteUser
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.put('/change-password', protect, changePassword);
router.delete('/delete', protect, deleteUser);

export default router;