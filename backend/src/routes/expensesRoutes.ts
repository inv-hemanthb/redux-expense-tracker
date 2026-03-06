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

/**
 * @openapi
 * components:
 *   schemas:
 *     ExpenseId:
 *       type: string
 *       description: Prisma CUID identifier
 *       example: cmmerlr4x00009zerw7ulq4sg
 *
 *     Expense:
 *       type: object
 *       properties:
 *         id:
 *           $ref: '#/components/schemas/ExpenseId'
 *         amount:
 *           type: number
 *           example: 20.5
 *         category:
 *           type: string
 *           example: food
 *         description:
 *           type: string
 *           nullable: true
 *           example: lunch
 *         expense_date:
 *           type: string
 *           format: date-time
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     CreateExpenseRequest:
 *       type: object
 *       required:
 *         - amount
 *         - category
 *         - expense_date
 *       properties:
 *         amount:
 *           type: number
 *         category:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         expense_date:
 *           type: string
 *           format: date-time
 *
 *     UpdateExpenseRequest:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *         category:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         expense_date:
 *           type: string
 *           format: date-time
 */


/**
 * @openapi
 * /api/expenses:
 *   post:
 *     summary: Create a new expense
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExpenseRequest'
 *     responses:
 *       201:
 *         description: Expense created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to create expense
 */
router.post("/", addExpense);


/**
 * @openapi
 * /api/expenses:
 *   get:
 *     summary: Get paginated list of expenses
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: List of expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Expense'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch expenses
 */
router.get("/", getAllExpenses);


/**
 * @openapi
 * /api/expenses/{id}:
 *   put:
 *     summary: Update an expense
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ExpenseId'
 *         description: Expense ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateExpenseRequest'
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       404:
 *         description: Expense not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to update expense
 */
router.put("/:id", updateExpense);


/**
 * @openapi
 * /api/expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ExpenseId'
 *         description: Expense ID
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to delete expense
 */
router.delete("/:id", deleteExpense);

export default router;