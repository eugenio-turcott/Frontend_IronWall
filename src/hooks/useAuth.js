import { useState, useEffect } from 'react';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userData = sessionStorage.getItem('userData');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        setIsLoading(false);
    }, []);

    const login = (userData, token) => {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');
        setUser(null);
    };

    return { user, isLoading, login, logout };
}