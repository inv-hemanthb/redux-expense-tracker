import express from 'express';
import {
    addExpense,
    getAllExpenses,
    updateExpense,
    deleteExpense
} from '../controllers/expensesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.post("/", addExpense);
router.get("/", getAllExpenses);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;