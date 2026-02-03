import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async (authToken) => {
        const targetToken = authToken || token;
        if (!targetToken) return;

        try {
            const res = await fetch(`${API_URL}/api/auth/me`, {
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
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
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
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
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
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    // Add refresh function to keep credits in sync
    const refreshUser = () => fetchUser();

    return (
        <AuthContext.Provider value={{
            user,
            token,
            setUser,
            setToken,
            login,
            register,
            logout,
            loading,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};
