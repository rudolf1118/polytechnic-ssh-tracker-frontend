'use client';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import LoadingScreen from "./common/LoadingScreen";

export default function AlreadySignedIn({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated]);

  if (loading) return <LoadingScreen />;

  return <>{children}</>;
}