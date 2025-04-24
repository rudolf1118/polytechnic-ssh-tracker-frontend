"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { authApi } from "@/api/index";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/Protected";

interface LoginParams {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginParams>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { setIsAuthenticated } = useAuth();
  const onSubmit = async (data: LoginParams) => {
    try {
      setLoading(true);
      await authApi.login(data);
      setIsAuthenticated(true);
      router.push("/");
    } catch (err) {
      setError("Password or Username is incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-black">
        <div className="w-full max-w-md bg-gray-100 p-8 rounded-xl shadow-lg">
        {loading && <LoadingScreen />} 
        <h1 className="text-3xl font-bold text-center text-black mb-8">Sign In</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Username"
              {...register("username", { required: "Username is required" })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-black"
            />
            {errors.username && <p className="text-red-500 text-sm font-medium">{errors.username.message?.toString()}</p>}
          </div>

          <div className="space-y-2">
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-black"
            />
            {errors.password && <p className="text-red-500 text-sm font-medium">{errors.password.message?.toString()}</p>}
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
    </ProtectedRoute>
  );
}
