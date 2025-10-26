"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/me", { withCredentials: true });
      setUser(res.data.data);
    } catch {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (code) => {
    try {
      const response = await api.post(
        "/auth/github",
        { code },
        { withCredentials: true }
      );
      setUser(response.data.data);
      setLoading(false);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Login failed: Email or password is wrong!",
      };
    }
  };

  const logout = async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
    setLoading(false); // do NOT re-call fetchUser
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
