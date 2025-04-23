'use client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '../components/Navbar';
import ProtectedRoute from '@/components/Protected';

export default function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated ? <Navbar /> : null}
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold">Welcome to SSH Activity Tracker</h1>
        <p className="mt-4 text-lg">This app will help you track users activity on the SSH server.</p>
      </div>
      <div className="bottom-0 w-full p-4 text-center text-sm text-gray-500">
        <p>Made by Rudolf Harutyunyan</p>
        <p className="mt-2">© 2025 SSH Activity Tracker.</p>
      </div>
    </>
  );
}