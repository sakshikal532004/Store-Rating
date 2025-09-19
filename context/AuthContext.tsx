import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';

const API_URL = 'http://localhost:4000/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'role' | 'storeId'>) => Promise<User | null>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserProfile = useCallback(async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const userData: User = await response.json();
      setUser(userData);
    } catch (error) {
      console.error(error);
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (token) {
      fetchUserProfile(token);
    } else {
      setIsLoading(false);
    }
  }, [token, fetchUserProfile]);

  const login = async (email: string, password: string): Promise<User | null> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const { token: authToken, user: loggedInUser } = await response.json();
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const register = async (userData: Omit<User, 'id' | 'role' | 'storeId'>): Promise<User | null> => {
     const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...userData, role: UserRole.Normal }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
    }

    const { token: authToken, user: newUser } = await response.json();
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(newUser);
    return newUser;
  };
  
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, register, updateUser }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
