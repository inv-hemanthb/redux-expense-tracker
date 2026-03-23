import { Modal, message } from "antd";
import ExpenseForm from "./ExpenseForm";
import { useDispatch, useSelector } from "react-redux";
import { closeExpenseModal } from "../../store/features/uiSlice";
import { useCreateExpenseMutation, useUpdateExpenseMutation } from "../../store/services/api";
import type { RootState } from "../../store/store";
import type { Expense } from "../../types/expense";

interface ExpenseModalProps {
    currentExpense?: Expense | null;
}

export default function ExpenseModal({ currentExpense }: ExpenseModalProps) {
    const dispatch = useDispatch();
    const isOpen = useSelector((s: RootState) => s.ui.expenseModalOpen);
    const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
    const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();

    const handleCancel = () => {
        dispatch(closeExpenseModal());
    };

    const handleSubmit = async (data: any) => {
        try {
            if (currentExpense) {
                await updateExpense({ id: currentExpense.id, data }).unwrap();
                message.success("Expense updated");
            } else {
                await createExpense(data).unwrap();
                message.success("Expense created");
            }
            dispatch(closeExpenseModal());
        } catch (e) {
            message.error("Operation failed");
        }
    };

    const loading = isCreating || isUpdating;
    const title = currentExpense ? "Edit Expense" : "Add Expense";

    return (
        <Modal
            open={isOpen}
            onCancel={handleCancel}
            title={title}
            footer={null}
            destroyOnClose
        >
            <ExpenseForm
                initialExpense={currentExpense}
                submitText={title}
                submitting={loading}
                onSubmit={handleSubmit}
            />
        </Modal>
    );
}
