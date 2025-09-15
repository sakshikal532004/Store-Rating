import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const DashboardRedirector: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    switch (user.role) {
        case UserRole.Admin:
            return <Navigate to="/dashboard/admin" replace />;
        case UserRole.Normal:
            return <Navigate to="/dashboard/user" replace />;
        case UserRole.StoreOwner:
            return <Navigate to="/dashboard/store-owner" replace />;
        default:
            // Fallback for any unexpected roles
            return <Navigate to="/" replace />;
    }
};

export default DashboardRedirector;
