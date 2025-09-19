import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomeScreen from './pages/HomeScreen';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardRedirector from './components/DashboardRedirector';
import AdminDashboard from './components/dashboards/AdminDashboard';
import UserDashboard from './components/dashboards/UserDashboard';
import StoreOwnerDashboard from './components/dashboards/StoreOwnerDashboard';
import { UserRole } from './types';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
};

const Main: React.FC = () => {
  const { user } = useAuth();

  const getDashboardElement = (role: UserRole, Component: React.ComponentType): React.ReactElement => {
    if (!user) return <Navigate to="/login" replace />;
    // If the user has the correct role, show the component, otherwise redirect them to their correct dashboard.
    return user.role === role ? <Component /> : <Navigate to="/dashboard" replace />;
  };

  return (
      <HashRouter>
          <div className="min-h-screen bg-gray-50 text-gray-800">
              <Routes>
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
                  <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />

                  {/* Protected Dashboard Routes with Layout */}
                  <Route element={<DashboardLayout />}>
                      <Route path="/dashboard" element={<DashboardRedirector />} />
                      <Route 
                        path="/dashboard/admin" 
                        element={getDashboardElement(UserRole.Admin, AdminDashboard)} 
                      />
                      <Route 
                        path="/dashboard/user" 
                        element={getDashboardElement(UserRole.Normal, UserDashboard)} 
                      />
                      <Route 
                        path="/dashboard/store-owner" 
                        element={getDashboardElement(UserRole.StoreOwner, StoreOwnerDashboard)} 
                      />
                  </Route>

                  <Route path="*" element={<Navigate to="/" />} />
              </Routes>
          </div>
      </HashRouter>
  );
};

export default App;
