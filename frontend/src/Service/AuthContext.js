import React, { createContext, useState, useEffect } from 'react';
import ApiService from './ApiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await ApiService.restoreTokenRefresh();
                const isValid = await ApiService.checkLoginStatus();
                setIsLoggedIn(isValid);
                if (isValid) {
                    const role = await ApiService.getUserRole();
                    setUserRole(role);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to initialize authentication:", error);
                setIsLoggedIn(false);
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userRole, setUserRole, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
