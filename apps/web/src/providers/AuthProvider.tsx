"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/auth";
import { authService } from "@/services/auth/auth.service";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const initAuth = async () => {
      try {
        // Calling getCurrentUser without a token. 
        // If unauthenticated, it will 401.
        // Interceptor will try to refresh using HttpOnly cookie.
        // If refresh works, me works and sets user.
        // If refresh fails, me fails and user is null.
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch {
        // Refresh failed or no session
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    // token is already set in memory by authService.login
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {}
    setUser(null);
    router.push("/login");
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
