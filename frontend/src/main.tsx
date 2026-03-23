import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { store } from './store/store';
import "antd/dist/reset.css";
import './index.css'
import App from './App.tsx'
import type { RootState } from './store/store';

function ThemedApp() {
    const mode = useSelector((state: RootState) => state.ui.theme);
    const isDark = mode === "dark";

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                token: {
                    borderRadius: 12,
                    colorPrimary: isDark ? "#7c8cff" : "#4f46e5",
                    colorInfo: isDark ? "#7c8cff" : "#4f46e5",
                    colorSuccess: isDark ? "#34d399" : "#059669",
                    colorWarning: isDark ? "#fbbf24" : "#d97706",
                    colorError: isDark ? "#f87171" : "#dc2626",
                    colorBgLayout: isDark ? "#0b1020" : "#f5f7ff",
                    colorBgContainer: isDark ? "#111827" : "#ffffff",
                    colorText: isDark ? "#e5e7eb" : "#111827",
                    colorTextSecondary: isDark ? "#9ca3af" : "#475569",
                    boxShadow: isDark
                        ? "0 8px 24px rgba(0, 0, 0, 0.35)"
                        : "0 8px 24px rgba(79, 70, 229, 0.12)"
                },
                components: {
                    Layout: {
                        headerBg: isDark ? "#111827" : "#ffffff",
                        bodyBg: isDark ? "#0b1020" : "#f5f7ff",
                        footerBg: isDark ? "#111827" : "#ffffff",
                    },
                    Menu: {
                        itemBg: "transparent",
                        itemBorderRadius: 10,
                        itemSelectedBg: isDark ? "rgba(124, 140, 255, 0.2)" : "rgba(79, 70, 229, 0.12)",
                        itemSelectedColor: isDark ? "#c7d2fe" : "#3730a3",
                        itemColor: isDark ? "#d1d5db" : "#1f2937",
                    },
                    Card: {
                        borderRadiusLG: 16
                    },
                    Button: {
                        borderRadius: 10
                    }
                }
            }}
        >
            <App />
        </ConfigProvider>
    );

}

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <StrictMode>
            <BrowserRouter>
                <ThemedApp />
            </BrowserRouter>
        </StrictMode>
    </Provider>,
)
