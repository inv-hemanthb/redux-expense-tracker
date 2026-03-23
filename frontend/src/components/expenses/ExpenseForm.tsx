import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import type { CreateExpenseRequest, Expense, UpdateExpenseRequest } from "../../types/expense";
import type { Dayjs } from "dayjs";

type FormValues = {
    amount: number;
    category: string;
    description?: string | null;
    expense_date: Dayjs;
};

interface ExpenseFormProps {
    initialExpense?: Expense | null;
    submitText: string;
    submitting?: boolean;
    onSubmit: (data: CreateExpenseRequest | UpdateExpenseRequest) => void | Promise<void>;
}

export default function ExpenseForm({
    initialExpense,
    submitText,
    submitting,
    onSubmit
}: ExpenseFormProps) {
    const [form] = Form.useForm<FormValues>();

    const initialValues: Partial<FormValues> | undefined = initialExpense
        ? {
            amount: initialExpense.amount,
            category: initialExpense.category,
            description: initialExpense.description ?? undefined,
            expense_date: dayjs(initialExpense.expense_date),
        }
        : undefined;

    const handleFinish = (values: FormValues) => {
        const payload: CreateExpenseRequest | UpdateExpenseRequest = {
            amount: values.amount,
            category: values.category,
            description: values.description ?? null,
            expense_date: values.expense_date.toISOString(),
        };
        onSubmit(payload);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={initialValues}
        >
            <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: "Please enter an amount" }]}
            >
                <InputNumber min={0} step={0.01} precision={2} className="w-full" />
            </Form.Item>

            <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: "Please choose a category" }]}
            >
                <Select
                    placeholder="Select category"
                    options={[
                        { value: "food", label: "Food" },
                        { value: "travel", label: "Travel" },
                        { value: "shopping", label: "Shopping" },
                        { value: "utilities", label: "Utilities" },
                        { value: "other", label: "Other" }
                    ]}
                />
            </Form.Item>

            <Form.Item label="Description" name="description">
                <Input placeholder="Optional notes" />
            </Form.Item>

            <Form.Item
                label="Expense Date"
                name="expense_date"
                rules={[{ required: true, message: "Please choose a date" }]}
            >
                <DatePicker showTime className="w-full" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={submitting}>
                    {submitText}
                </Button>
            </Form.Item>
        </Form>
    );
}
