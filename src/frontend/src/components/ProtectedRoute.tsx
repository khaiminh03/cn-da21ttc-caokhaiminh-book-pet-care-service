import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    allowedRoles: string[];
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
    const accessToken = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('userRole');

    // Kiểm tra nếu không có access token hoặc role không hợp lệ
    if (!accessToken || !userRole || !allowedRoles.includes(userRole)) {
        return <Navigate to="/trangchu" />; // Điều hướng về trang đăng nhập nếu không có quyền
    }

    return <>{children}</>; // Render các route con nếu có quyền truy cập
};

export default ProtectedRoute;
