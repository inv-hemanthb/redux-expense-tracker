import { Button, Card, Form, Input, Modal, Space, Typography, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BaseLayout from "../components/layout/BaseLayout";
import { logout, updateToken } from "../store/features/authSlice";
import { useChangePasswordMutation, useDeleteAccountMutation } from "../store/services/api";
import type { AppDispatch } from "../store/store";
import type { ChangePasswordRequest } from "../types/auth";

interface ApiError {
    status?: number;
    data?: {
        error?: string;
    };
}

export default function UserEditPage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
    const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();

    const getApiErrorMessage = (error: unknown, fallback: string) => {
        const typedError = error as ApiError;
        if (typedError?.data?.error) {
            return typedError.data.error;
        }
        if (typedError?.status === 401) {
            return "Unauthorized request";
        }
        if (typedError?.status === 404) {
            return "Resource not found";
        }
        return fallback;
    };

    const onChangePassword = async (values: ChangePasswordRequest & { confirmNewPassword: string }) => {
        try {
            const res = await changePassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            }).unwrap();

            dispatch(updateToken(res.token));
            messageApi.success("Password changed successfully");
        } catch (error) {
            messageApi.error(getApiErrorMessage(error, "Failed to change password"));
        }
    };

    const onDeleteAccount = () => {
        Modal.confirm({
            title: "Delete account?",
            content: "This action is permanent and cannot be undone.",
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    const res = await deleteAccount().unwrap();
                    dispatch(logout());
                    messageApi.success(res.message || "Account deleted");
                    navigate("/login");
                } catch (error) {
                    messageApi.error(getApiErrorMessage(error, "Failed to delete account"));
                }
            }
        });
    };

    return (
        <BaseLayout headerMode="app">
            {contextHolder}
            <div className="mx-auto w-full max-w-3xl space-y-6">
                <div className="space-y-1">
                    <Typography.Title level={2} style={{ margin: 0 }} className="page-title">
                        User Edit
                    </Typography.Title>
                    <Typography.Text className="page-subtitle">
                        Manage your account security settings.
                    </Typography.Text>
                </div>

                <Card title="Change Password" className="shadow-lg shadow-indigo-500/10">
                    <Form layout="vertical" onFinish={onChangePassword}>
                        <Form.Item
                            label="Old Password"
                            name="oldPassword"
                            rules={[{ required: true, message: "Please enter your old password" }]}
                        >
                            <Input.Password autoComplete="current-password" />
                        </Form.Item>

                        <Form.Item
                            label="New Password"
                            name="newPassword"
                            rules={[{ required: true, message: "Please enter your new password" }]}
                        >
                            <Input.Password autoComplete="new-password" />
                        </Form.Item>

                        <Form.Item
                            label="Confirm New Password"
                            name="confirmNewPassword"
                            dependencies={["newPassword"]}
                            rules={[
                                { required: true, message: "Please confirm your new password" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newPassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Passwords do not match"));
                                    }
                                })
                            ]}
                        >
                            <Input.Password autoComplete="new-password" />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" loading={isChangingPassword}>
                            Update Password
                        </Button>
                    </Form>
                </Card>

                <Card
                    title="Danger Zone"
                    className="border border-red-500/30 shadow-lg shadow-red-500/10"
                    style={{ marginTop: 12 }}
                >
                    <Space direction="vertical" size={8} style={{ width: "100%" }}>
                        <Typography.Text>
                            Deleting your account will remove your access permanently.
                        </Typography.Text>
                        <Button danger onClick={onDeleteAccount} loading={isDeletingAccount}>
                            Delete Account
                        </Button>
                    </Space>
                </Card>
            </div>
        </BaseLayout>
    );
}
