import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthResponse, AuthUser } from "../../types/auth";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

const initialState: AuthState = {
    user: user ? JSON.parse(user) as AuthUser : null,
    token: token ?? null,
    isAuthenticated: !!token
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<AuthResponse>) {
            const { id, username, token } = action.payload;
            const user = { id, username };

            state.user = user;
            state.token = token;
            state.isAuthenticated = true;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        },

        updateToken(state, action: PayloadAction<string>) {
            state.token = action.payload
            localStorage.setItem("token", action.payload)
        },

        logout(state) {
            state.user = null
            state.token = null
            state.isAuthenticated = false

            localStorage.removeItem("token")
            localStorage.removeItem("user")
        }
    }
});

export const {
    setCredentials,
    updateToken,
    logout
} = authSlice.actions;

export default authSlice.reducer;