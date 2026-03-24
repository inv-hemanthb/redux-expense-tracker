import { Button, Layout, Menu, Space, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { logout } from "../../store/features/authSlice";
import { toggleTheme } from "../../store/features/uiSlice";
import { useGetExpensesQuery } from "../../store/services/api";
import type { AppDispatch, RootState } from "../../store/store";
import type { BaseLayoutProps } from "../../types/layout";

const { Header, Content, Footer } = Layout;

export default function BaseLayout({ children, headerMode }: BaseLayoutProps) {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useSelector((state: RootState) => state.ui.theme);

    const { data } = useGetExpensesQuery(
        { page: 1, limit: 1000 },
        { skip: headerMode !== "app" }
    );

    const now = dayjs();
    const totalExpenses = data?.data?.reduce((sum, expense) => {
        if (!dayjs(expense.expense_date).isSame(now, "month")) {
            return sum;
        }
        return sum + expense.amount;
    }, 0) ?? 0;
    const headerBg = theme === "dark" ? "#111827" : "#ffffff";
    const headerTextColor = theme === "dark" ? "#e5e7eb" : "#111827";
    const headerBorder = theme === "dark" ? "1px solid #1f2937" : "1px solid #e2e8f0";
    const contentBg = theme === "dark" ? "#0b1020" : "#f5f7ff";
    const footerColor = theme === "dark" ? "#9ca3af" : "#475569";

    const onLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <Layout style={{ minHeight: "100vh" }} className="transition-colors duration-300">
            <Header
                className="px-0"
                style={{
                    background: headerBg,
                    borderBottom: headerBorder
                }}
            >
                <div className="app-container flex h-full items-center justify-between gap-4 py-2">
                    {headerMode === "app" ? (
                        <div className="flex min-w-0 flex-1 items-center gap-6 overflow-x-auto">
                            <Menu
                                mode="horizontal"
                                theme={theme}
                                selectedKeys={[location.pathname === "/user" ? "/user" : "/"]}
                                items={[
                                    { key: "/", label: "Dashboard" },
                                    { key: "/user", label: "User Edit" }
                                ]}
                                onClick={({ key }) => navigate(key)}
                                style={{ minWidth: 260, background: "transparent", color: headerTextColor }}
                            />
                            <Typography.Text style={{ color: headerTextColor, fontWeight: 600, whiteSpace: "nowrap" }}>
                                Total (This Month): ₹{totalExpenses.toFixed(2)}
                            </Typography.Text>
                        </div>
                    ) : (
                        <div className="flex-1" />
                    )}

                    <Space style={{ flexShrink: 0 }}>
                        <Button onClick={() => dispatch(toggleTheme())}>
                            Theme: {theme === "dark" ? "Dark" : "Light"}
                        </Button>
                        {headerMode === "app" && (
                            <Button onClick={onLogout}>Logout</Button>
                        )}
                    </Space>
                </div>
            </Header>

            <Content style={{ background: contentBg }} className="app-section transition-colors duration-300">
                <div className="app-container">{children}</div>
            </Content>

            <Footer style={{ textAlign: "center", color: footerColor, background: headerBg }}>
                Copyright 2026
            </Footer>
        </Layout>
    );
}
