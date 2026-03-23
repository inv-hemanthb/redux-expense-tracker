
import { Button, Card, Form, Input, Tabs, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation, useRegisterMutation } from "../store/services/api";
import { setCredentials } from "../store/features/authSlice";
import BaseLayout from "../components/layout/BaseLayout";
import type { AppDispatch } from "../store/store";
import type { LoginRequest, RegisterRequest } from "../types/auth";

export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [login, { isLoading: isLoggingIn }] = useLoginMutation();
    const [register, { isLoading: isRegistering }] = useRegisterMutation();

    const onLogin = async (values: LoginRequest) => {
        try {
            const res = await login(values).unwrap();
            dispatch(setCredentials(res));
            message.success("Logged in successfully");
            navigate("/");
        } catch (e) {
            message.error("Invalid credentials");
        }
    };

    const onSignup = async (values: RegisterRequest) => {
        try {
            const res = await register(values).unwrap();
            dispatch(setCredentials(res));
            message.success("Account created");
            navigate("/");
        } catch (e) {
            message.error("Signup failed");
        }
    };

    return (
        <BaseLayout headerMode="public">
            <section className="flex min-h-[70vh] items-center justify-center py-6 sm:py-10">
                <Card className="w-full max-w-md shadow-lg shadow-indigo-500/10">
                    <Typography.Title level={3} style={{ textAlign: "center", marginBottom: 16 }}>
                        Expense Tracker
                    </Typography.Title>
                    <Tabs
                        defaultActiveKey="login"
                        items={[
                            {
                                key: "login",
                                label: "Login",
                                children: (
                                    <Form layout="vertical" onFinish={onLogin}>
                                        <Form.Item
                                            label="Username"
                                            name="username"
                                            rules={[{ required: true, message: "Please enter your username" }]}
                                        >
                                            <Input autoComplete="username" />
                                        </Form.Item>
                                        <Form.Item
                                            label="Password"
                                            name="password"
                                            rules={[{ required: true, message: "Please enter your password" }]}
                                        >
                                            <Input.Password autoComplete="current-password" />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                block
                                                loading={isLoggingIn}
                                            >
                                                Log in
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                )
                            },
                            {
                                key: "signup",
                                label: "Sign up",
                                children: (
                                    <Form layout="vertical" onFinish={onSignup}>
                                        <Form.Item
                                            label="Username"
                                            name="username"
                                            rules={[{ required: true, message: "Please choose a username" }]}
                                        >
                                            <Input autoComplete="username" />
                                        </Form.Item>
                                        <Form.Item
                                            label="Password"
                                            name="password"
                                            rules={[{ required: true, message: "Please choose a password" }]}
                                        >
                                            <Input.Password autoComplete="new-password" />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                block
                                                loading={isRegistering}
                                            >
                                                Create account
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                )
                            }
                        ]}
                    />
                </Card>
            </section>
        </BaseLayout>
    );
}