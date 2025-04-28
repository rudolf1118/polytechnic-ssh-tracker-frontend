'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '@/api/auth/auth.api';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  setIsAuthenticated: (value: boolean) => void;
  role: 'admin' | 'user' | null;
  setRole: (value: 'admin' | 'user' | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const account = await authApi.verifyToken();
        setIsAuthenticated(account.verified);
        setRole(account.role as 'admin' | 'user' | null || null);
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsAuthenticated(false);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, setIsAuthenticated, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};