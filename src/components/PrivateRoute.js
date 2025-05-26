// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
    const { token } = useAuth();
    // console.log("🔐 PrivateRoute | token =", token);

    // if (!token || token === "null" || token === "undefined") {
    //     console.warn("🚫 No valid token, redirecting to /login");
    //     return <Navigate to="/login" />;
    // }

    return children;
};
export default PrivateRoute;
