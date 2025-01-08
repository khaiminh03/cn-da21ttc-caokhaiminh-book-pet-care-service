import React, { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';

interface LayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen">
            {/* Sidebar cố định */}
            <div className="w-64 bg-gray-800 text-white fixed h-full">
                <Sidebar />
            </div>

            {/* Nội dung chính */}
            <div className="flex-1 ml-64 bg-gray-100 p-6 overflow-auto">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
