import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "./calls";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  token: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  StatusId: number;
  authToken: string;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async (email: string, password: string) => {},
  logout: () => {},
  token: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [token, setToken] = useState<any>(null);
  const [sessionTimer, setSessionTimer] = useState<any>(null);

  useEffect(() => {
    if (!token) setToken(localStorage.getItem("accessToken"));
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await loginUser(email, password);

    if (!response.success) {
      return response;
    }

    const { user } = response.data;
    setUser(user);
    setToken(response.data.accessToken);
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("user", user);
    return response;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
  };

  // Function to start session timer
  const startSessionTimer = () => {
    setSessionTimer(
      setTimeout(() => {
        logout();
      },8000) // logout after 1 hour of inactivity
    );
  };

  // Function to reset session timer
  const resetSessionTimer = () => {
    clearTimeout(sessionTimer);
    startSessionTimer();
  };

  // Function to handle user activity
  const handleUserActivity = () => {
    resetSessionTimer();
  };

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem("accessToken");
    if (loggedInUser) {
      setToken(loggedInUser);
      startSessionTimer();
    }
    // Add event listener for user activity
    window.addEventListener("mousemove", handleUserActivity);
    // Remove event listener on unmount
    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      clearTimeout(sessionTimer);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
