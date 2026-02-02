import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token) => {
        const targetToken = token || localStorage.getItem('token');
        if (!targetToken) return;

        try {
            const res = await fetch('/api/auth/me', {
                headers: {
                    'x-auth-token': targetToken,
                    'Authorization': `Bearer ${targetToken}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
            } else {
                logout();
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            // Don't logout on network error, only on 401
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                // The login response might have partial user, let's fetch full profile
                await fetchUser(data.token);
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (err) {
            return { success: false, error: 'Erro de conexão com o servidor.' };
        }
    };

    const register = async (userData) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                await fetchUser(data.token);
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (err) {
            return { success: false, error: 'Erro ao criar conta.' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Add refresh function to keep credits in sync
    const refreshUser = () => fetchUser();

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};
