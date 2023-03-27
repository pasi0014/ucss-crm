import React, { createContext, useContext, useState } from "react";
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
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  console.log(localStorage.getItem("accessToken"));

  const login = async (email: string, password: string) => {
    const response = await loginUser(email, password);

    if (!response.success) {
      return response;
    }

    const { user } = response.data;
    console.log({ response });
    setUser(user);
    setToken(response.data.accessToken);
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("user", user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
