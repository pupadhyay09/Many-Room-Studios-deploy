// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { StorageKyes } from "../constant/constant";
import { localGetItem, localRemoveItem, localSetItem } from "../services/localStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localGetItem(StorageKyes.token) || null);

    // Sync token across tabs
    useEffect(() => {
        const handleStorage = () => {
            setToken(localGetItem(StorageKyes.token) || null);
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const login = (newToken) => {
        localSetItem(StorageKyes.token, newToken);
        setToken(newToken);
    };

    const logout = () => {
        localRemoveItem(StorageKyes.token);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
