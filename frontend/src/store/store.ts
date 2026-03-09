import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./features/uiSlice";
import authReducer from "./features/authSlice";
import {api} from "./services/api";

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        auth: authReducer,
        [api.reducerPath]: api.reducer
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;