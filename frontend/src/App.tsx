import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserEditPage from './pages/UserEditPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/login" replace={true} />;
    }
    return (
        <>
            {children}
        </>
    );
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/user"
                element={
                    <ProtectedRoute>
                        <UserEditPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}