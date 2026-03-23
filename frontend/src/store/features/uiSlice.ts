import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Theme, UIState } from "../../types/ui";

const storedTheme = localStorage.getItem("theme");

const initialState: UIState = {
    theme: (storedTheme === "light" || storedTheme === "dark") ? storedTheme : "dark",
    expenseModalOpen: false,
    editingExpenseId: null
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleTheme(state) {
            state.theme = state.theme === "dark" ? "light" : "dark";
            localStorage.setItem("theme", state.theme);
        },

        setTheme(state, action: PayloadAction<Theme>) {
            state.theme = action.payload;
            localStorage.setItem("theme", action.payload);
        },

        openExpenseModal(state) {
            state.expenseModalOpen = true;
        },

        closeExpenseModal(state) {
            state.expenseModalOpen = false;
        },

        setEditingExpense(state, action: PayloadAction<string>) {
            state.editingExpenseId = action.payload;
        },

        clearEditingExpense(state) {
            state.editingExpenseId = null;
        }
    }
});

export const {
    toggleTheme,
    setTheme,
    openExpenseModal,
    closeExpenseModal,
    setEditingExpense,
    clearEditingExpense
} = uiSlice.actions;

export default uiSlice.reducer;