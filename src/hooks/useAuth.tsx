'use client';
import { useEffect, useState } from "react";
import { authApi } from "@/api/auth/auth.api";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const ok = await authApi.verifyToken();
      setIsAuthenticated(ok);
      setLoading(false);
    })();
  }, []);

  return { loading, isAuthenticated };
}