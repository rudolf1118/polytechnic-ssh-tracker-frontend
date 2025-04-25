'use client';
import { useEffect, useState } from "react";
import { authApi } from "@/api/auth/auth.api";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const ok = await authApi.verifyToken();
        setIsAuthenticated(ok);
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  return { loading, isAuthenticated };
}