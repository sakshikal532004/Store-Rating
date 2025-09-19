
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomeHeader: React.FC = () => {
  const { user } = useAuth();
  return (
    <header className="absolute top-0 left-0 right-0 z-10 bg-transparent py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-3xl font-bold text-white tracking-wider">
          StoreRating
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="px-5 py-2 bg-white text-indigo-700 font-semibold rounded-full shadow-md hover:bg-gray-100 transition">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2 bg-white/20 text-white font-semibold rounded-full hover:bg-white/30 transition backdrop-blur-sm">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2 bg-white text-indigo-700 font-semibold rounded-full shadow-md hover:bg-gray-100 transition">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
export default HomeHeader;
