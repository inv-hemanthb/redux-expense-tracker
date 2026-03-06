import { prisma } from '../lib/prisma.js';
import { getErrorMessage } from '../utils/error.js';

import type { Request, Response } from 'express';

export async function addExpense(req: Request, res: Response) {
    try {
        const userId = req.user!;
        const { amount, category, description, expense_date } = req.body;

        const expense = await prisma.expense.create({
            data: {
                user_id: userId,
                amount: amount,
                category: category,
                description: description ?? null,
                expense_date: new Date(expense_date)
            }
        });

        return res.status(201).json(expense);
    }
    catch (error) {
        console.error("Error creating new expense: ", getErrorMessage(error));
        return res.status(500).json({
            error: "Failed to create new expense"
        });
    }
}

export async function getAllExpenses(req: Request, res: Response) {
    try {
        const userId = req.user!;
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 10, 1);

        const skip = (page - 1) * limit;

        const expenses = await prisma.expense.findMany({
            where: {
                user_id: userId,
            },
            orderBy: {
                expense_date: "desc",
            },
            skip: skip,
            take: limit,
            select: {
                id: true,
                user_id: false,
                amount: true,
                category: true,
                description: true,
                expense_date: true,
                created_at: true,
                updated_at: true
            }
        });

        const total = await prisma.expense.count({
            where: { user_id: userId }
        });

        return res.json({
            data: expenses,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    }
    catch (error) {
        console.error("Error fetching expenses: ", getErrorMessage(error));
        return res.status(500).json({
            error: "Failed to fetch expenses"
        });
    }
}

export async function updateExpense(req: Request, res: Response) {
    try {
        const userId = req.user!;
        const expenseId = req.params.id as string;

        const { amount, category, description, expense_date } = req.body;

        const expense = await prisma.expense.updateMany({
            where: {
                id: expenseId,
                user_id: userId
            },
            data: {
                amount,
                category,
                description: description ?? null,
                expense_date: expense_date ? new Date(expense_date) : undefined
            }
        });

        if (expense.count === 0) {
            return res.status(404).json({
                error: "Expense not found"
            });
        }

        return res.json({
            message: "Expense updated successfully"
        });
    }
    catch (error) {
        console.error("Error updating expense: ", getErrorMessage(error));
        return res.status(500).json({
            error: "Failed to update expense"
        });
    }
}

export async function deleteExpense(req: Request, res: Response) {
    try {
        const userId = req.user!;
        const expenseId = req.params.id as string;

        const result = await prisma.expense.deleteMany({
            where: {
                id: expenseId,
                user_id: userId
            }
        });

        if (result.count === 0) {
            return res.status(404).json({
                error: "Expense not found"
            });
        }

        return res.json({
            message: "Expense deleted successfully"
        });
    }
    catch (error) {
        console.error("Error deleting expense: ", getErrorMessage(error));
        return res.status(500).json({
            error: "Failed to delete expense"
        });
    }
}