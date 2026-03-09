import type { Expense } from "./expense"

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
}

export interface PaginatedExpenseResponse {
  data: Expense[]
  pagination: PaginationMeta
}