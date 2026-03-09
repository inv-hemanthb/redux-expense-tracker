export interface Expense {
    id: string
    amount: number
    category: string
    description: string | null
    expense_date: string
    created_at: string
    updated_at: string
}

export interface CreateExpenseRequest {
    amount: number
    category: string
    description?: string | null
    expense_date: string
}

export interface UpdateExpenseRequest {
    amount?: number
    category?: string
    description?: string | null
    expense_date?: string
}