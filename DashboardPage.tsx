
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import Header from '../components/Header';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import UserDashboard from '../components/dashboards/UserDashboard';
import StoreOwnerDashboard from '../components/dashboards/StoreOwnerDashboard';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    const renderDashboard = () => {
        switch (user?.role) {
            case UserRole.Admin:
                return <AdminDashboard />;
            case UserRole.Normal:
                return <UserDashboard />;
            case UserRole.StoreOwner:
                return <StoreOwnerDashboard />;
            default:
                return <div className="text-center p-8">Invalid user role.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8">
                {renderDashboard()}
            </main>
        </div>
    );
};

export default DashboardPage;
