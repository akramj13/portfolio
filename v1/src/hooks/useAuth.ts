"use client";

import { useState, useEffect } from "react";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/admin/api/auth", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        setAuthState({
          isAuthenticated: data.authenticated || false,
          isLoading: false,
          error: null,
        });
      } catch {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: "Failed to check authentication",
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
}
