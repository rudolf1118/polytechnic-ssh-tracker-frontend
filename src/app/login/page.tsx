"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { authApi } from "@/api/index";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useAuth } from "@/context/AuthContext";
import AlreadySignedIn from "@/components/AlreadySignedIn";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface LoginParams {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginParams>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { setIsAuthenticated, setRole } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: LoginParams) => {
    try {
      setLoading(true);
      const res = await authApi.login(data);
      setIsAuthenticated(true);
      setRole(res.user.role || 'user');
      router.push("/");
    } catch (err) {
      setError("Password or Username is incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlreadySignedIn>
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

            <div className="space-y-2 relative">
              <div className="flex items-center relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-black"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 z-10"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm font-medium">{errors.password.message?.toString()}</p>}
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </AlreadySignedIn>
  );
}
