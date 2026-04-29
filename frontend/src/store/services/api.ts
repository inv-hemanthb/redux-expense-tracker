import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    ChangePasswordRequest,
    ChangePasswordResponse
} from "../../types/auth";

import type {
    Expense,
    CreateExpenseRequest,
    UpdateExpenseRequest
} from "../../types/expense";

import type { PaginatedExpenseResponse } from "../../types/pagination";
import type { RootState } from "../store";

export const api = createApi({
    reducerPath: "api",

    baseQuery: fetchBaseQuery({
        baseUrl:
            import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",

        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),

    tagTypes: ["Expenses"],

    endpoints: (builder) => ({
        // auth
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body
            })
        }),

        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (body) => ({
                url: "/auth/register",
                method: "POST",
                body
            })
        }),

        changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
            query: (body) => ({
                url: "/auth/change-password",
                method: "PUT",
                body
            })
        }),

        deleteAccount: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/auth/delete",
                method: "DELETE"
            })
        }),

        // expenses
        getExpenses: builder.query<PaginatedExpenseResponse, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 10 }) => `/expenses?page=${page}&limit=${limit}`,
            providesTags: ["Expenses"]
        }),

        createExpense: builder.mutation<Expense, CreateExpenseRequest>({
            query: (body) => ({
                url: "/expenses",
                method: "POST",
                body
            }),

            invalidatesTags: ["Expenses"]
        }),

        updateExpense: builder.mutation<void, { id: string; data: UpdateExpenseRequest }>({
            query: ({id, data}) => ({
                url: `/expenses/${id}`,
                method: "PUT",
                body: data
            }),

            invalidatesTags: ["Expenses"]
        }),

        deleteExpense: builder.mutation<void, string>({
            query: (id) => ({
                url: `/expenses/${id}`,
                method: "DELETE"
            }),

            invalidatesTags: ["Expenses"]
        })
    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useChangePasswordMutation,
    useDeleteAccountMutation,

    useGetExpensesQuery,
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation,
    
} = api;