export type Theme = "light" | "dark";

export interface UIState {
    theme: Theme;
    expenseModalOpen: boolean;
    editingExpenseId: string | null;
}
