import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const DashboardLayout: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
