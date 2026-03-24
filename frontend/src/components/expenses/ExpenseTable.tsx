import { Button, Popconfirm, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDeleteExpenseMutation, useGetExpensesQuery } from "../../store/services/api";
import type { Expense } from "../../types/expense";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

interface ExpenseTableProps {
    onEdit: (expense: Expense) => void;
    filterCategory?: string | null;
}

export default function ExpenseTable({ onEdit, filterCategory }: ExpenseTableProps) {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { data, isFetching } = useGetExpensesQuery({ page, limit });
    const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

    // Flatten API response to table data
    const expenses = data?.data ?? [];
    const total = data?.pagination?.total ?? expenses.length;

    useEffect(() => {
        if (expenses.length === 0 && page > 1) {
            setPage(1);
        }
    }, [expenses.length, page]);

    const handleDelete = async (id: string) => {
        await deleteExpense(id).unwrap();
    };

    const columns: ColumnsType<Expense> = useMemo(() => [
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (v: number) => `₹${v.toFixed(2)}`
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (c: string) => <Tag>{c}</Tag>
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            render: (d?: string | null) => d ?? "-"
        },
        {
            title: "Expense Date",
            dataIndex: "expense_date",
            key: "expense_date",
            render: (d: string) => {
                const expenseDate = dayjs(d);
                const isUpcoming = expenseDate.isAfter(dayjs().endOf("month"));

                return (
                    <div className="flex items-center gap-2">
                        <span>{expenseDate.format("YYYY-MM-DD")}</span>
                        {isUpcoming ? <Tag color="blue" className="opacity-80">Upcoming</Tag> : null}
                    </div>
                );
            }
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <Button size="small" onClick={() => onEdit(record)}>Edit</Button>
                    <Popconfirm
                        title="Delete expense?"
                        okText="Delete"
                        cancelText="Cancel"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger size="small" loading={isDeleting}>Delete</Button>
                    </Popconfirm>
                </div>
            )
        }
    ], [isDeleting, onEdit]);

    const filteredExpenses = useMemo(() => {
        if (!filterCategory) return expenses;
        const normalizedFilter = filterCategory.toLowerCase();
        return expenses.filter((e) => e.category.toLowerCase().includes(normalizedFilter));
    }, [expenses, filterCategory]);

    return (
        <div className="app-section">
            <Table
                rowKey="id"
                loading={isFetching}
                dataSource={filteredExpenses}
                columns={columns}
                rowClassName={(record) => {
                    const expenseDate = dayjs(record.expense_date);
                    if (expenseDate.isBefore(dayjs().startOf("month"))) {
                        return "opacity-60 text-slate-500 line-through decoration-2 decoration-slate-500 dark:opacity-40";
                    }
                    if (expenseDate.isAfter(dayjs().endOf("month"))) {
                        return "bg-sky-100/70 text-sky-700 dark:bg-sky-500/5 dark:text-sky-300";
                    }
                    return "";
                }}
                pagination={{
                    current: page,
                    pageSize: limit,
                    total,
                    showSizeChanger: true,
                    onChange: (p, ps) => {
                        setPage(p);
                        setLimit(ps);
                    }
                }}
            />
        </div>
    );
}
