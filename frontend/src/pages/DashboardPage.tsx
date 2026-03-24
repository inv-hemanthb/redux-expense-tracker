import { Button, Input } from "antd";
import { useDispatch } from "react-redux";
import BaseLayout from "../components/layout/BaseLayout";
import ExpenseTable from "../components/expenses/ExpenseTable";
import ExpenseModal from "../components/expenses/ExpenseModal";
import { clearEditingExpense, openExpenseModal, setEditingExpense } from "../store/features/uiSlice";
import type { Expense } from "../types/expense";
import { useState } from "react";

export default function DashboardPage() {
    const dispatch = useDispatch();
    const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

    const handleAdd = () => {
        dispatch(clearEditingExpense());
        dispatch(openExpenseModal());
        setCurrentExpense(null);
    };

    const handleEdit = (expense: Expense) => {
        dispatch(setEditingExpense(expense.id));
        dispatch(openExpenseModal());
        setCurrentExpense(expense);
    };

    return (
        <BaseLayout headerMode="app">
            <div className="space-y-6">
                <div className="rounded-2xl border border-indigo-500/20 bg-white/70 p-6 shadow-lg shadow-indigo-500/10 backdrop-blur dark:bg-slate-900/60">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h1 className="page-title">Dashboard</h1>
                            <p className="page-subtitle mt-2">Track your expenses here.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Input
                                placeholder="Filter by category"
                                className="min-w-48"
                                value={categoryFilter ?? ""}
                                onChange={(e) => setCategoryFilter(e.target.value.trim() || null)}
                                allowClear
                            />
                            <Button type="primary" onClick={handleAdd}>
                                Add Expense
                            </Button>
                        </div>
                    </div>
                </div>

                <ExpenseTable onEdit={handleEdit} filterCategory={categoryFilter} />

                <ExpenseModal currentExpense={currentExpense ?? undefined} />
            </div>
        </BaseLayout>
    );
}