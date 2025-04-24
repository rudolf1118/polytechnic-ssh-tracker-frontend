'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from './Protected';
import { authApi } from '@/api/auth/auth.api';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <ProtectedRoute>
    <nav className={`fixed top-0 left-0 right-0 flex justify-between items-center p-4 md:p-6 bg-gray-800 text-white z-50 shadow-lg backdrop-blur-sm bg-opacity-90 transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <div className="text-lg md:text-xl font-bold tracking-tight hover:scale-105 transition-transform duration-300">
        <Link href="/" className="hover:text-blue-300 transition-colors duration-300">Activity Tracker</Link>
      </div>
      
      {/* Mobile menu button - only visible on small screens */}
      <div className="md:hidden">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="text-white focus:outline-none transition-transform duration-300 ease-in-out hover:scale-110"
        >
          <svg 
            className={`w-6 h-6 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
              className="transition-all duration-300"
            />
          </svg>
        </button>
      </div>
      
      {/* Desktop menu - hidden on small screens */}
      <div className="hidden md:flex gap-4 lg:gap-6">
        {isAuthenticated ? (
          <>
          <Link href="/profile" className={`nav-link hover:text-gray-200 transition-all duration-300 hover:scale-105 ${pathname === '/profile' ? 'text-blue-400 font-semibold border-b-2 border-blue-400' : ''}`}>Profile</Link>
          <Link href="/my-activity" className={`nav-link hover:text-gray-200 transition-all duration-300 hover:scale-105 ${pathname === '/my-activity' ? 'text-blue-400 font-semibold border-b-2 border-blue-400' : ''}`}>My Activity</Link>
          <Link href="/students" className={`nav-link hover:text-gray-200 transition-all duration-300 hover:scale-105 ${pathname.includes('/students') ? 'text-blue-400 font-semibold border-b-2 border-blue-400' : ''}`}>Students</Link>
          <Link href="/top-students " className={`nav-link hover:text-gray-200 transition-all duration-300 hover:scale-105 ${pathname.includes('/top-students') ? 'text-blue-400 font-semibold border-b-2 border-blue-400' : ''}`}>Top Students</Link>
          <Link href="/logout" className="nav-link hover:text-red-300 transition-all duration-300 hover:scale-105 " onClick={() => {authApi.logout(); setIsAuthenticated(false);}}>Logout</Link>
        </>
        ) : (
          <>
            <Link href="/login" className="nav-link hover:text-blue-300 transition-all duration-300 hover:scale-105">Login</Link>
          </>
        )}
      </div>
      
      {/* Mobile menu - conditionally rendered */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-800 p-4 md:hidden flex flex-col gap-4 shadow-lg animate-fadeIn transition-all duration-300 transform origin-top">
          {isAuthenticated ? (
            <>
              <Link href="/profile" className={`nav-link hover:text-blue-300 py-2 transform transition-all duration-300 hover:translate-x-2 hover:text-blue-300 ${pathname === '/profile' ? 'text-blue-400 font-semibold' : ''} animate-slideIn`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
              <Link href="/my-activity" className={`nav-link hover:text-blue-300 py-2 transform transition-all duration-300 hover:translate-x-2 hover:text-blue-300 ${pathname === '/my-activity' ? 'text-blue-400 font-semibold' : ''} animate-slideIn`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>My Activity</Link>
              <Link href="/students" className={`nav-link hover:text-blue-300 py-2 transform transition-all duration-300 hover:translate-x-2 hover:text-blue-300 ${pathname === '/students' ? 'text-blue-400 font-semibold' : ''} animate-slideIn`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>Students</Link>
              <Link href="/top-students " className={`nav-link hover:text-blue-300 py-2 transform transition-all duration-300 hover:translate-x-2 hover:text-blue-300 ${pathname.includes('/top-students') ? 'text-blue-400 font-semibold' : ''} animate-slideIn`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>Top Students</Link>
              <span className="nav-link text-red-400 py-2 transform transition-all duration-300 hover:translate-x-2 hover:text-red-300 font-medium animate-slideIn border-l-2 border-red-500 pl-2" style={{animationDelay: '250ms'}} onClick={() => {authApi.logout(); setMobileMenuOpen(false);}}>Logout</span>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link hover:text-blue-300 py-2 transform transition-all duration-300 hover:translate-x-2 animate-slideIn" style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>Login</Link>
            </>
          )}
        </div>
      )}
    </nav>
    </ProtectedRoute>
  );
}