"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, type User, type LoginCredentials, type RegisterData } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string, companyName: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
            if (token) {
                try {
                    const currentUser = await api.getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    console.error('[AuthContext] Session restoration failed:', error);
                    api.clearToken();
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.login({ username: email, password });
            setUser(response.user);
        } catch (error: any) {
            throw error;
        }
    };

    const register = async (email: string, password: string, fullName: string, companyName: string) => {
        try {
            const newUser = await api.register({ email, password, full_name: fullName, company_name: companyName });
            // After registration, we usually log in automatically
            await login(email, password);
        } catch (error: any) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        api.clearToken();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
