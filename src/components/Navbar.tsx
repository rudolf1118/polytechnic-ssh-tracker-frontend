'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from './Protected';
import { authApi } from '@/api/auth/auth.api';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Profile', href: '/profile' },
    { name: 'My Activity', href: '/my-activity' },
    { name: 'Students', href: '/students' },
    { name: 'Top Students', href: '/top-students' },
    { name: 'SSH Terminal', href: '/ssh-connection' },
  ];

  return (
    <ProtectedRoute>
      <nav className="bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-950 text-white light-black:bg-gray-800 fixed w-full z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight hover:scale-105 transition-transform font-sans">
              SSH Tracker
            </Link>

            <div className="hidden md:flex space-x-8 items-center">
              {isAuthenticated ? (
                navLinks.map(({ name, href }) => (
                  <Link
                    key={name}
                    href={href}
                    className={`text-md font-medium hover:text-yellow-800 transition-colors duration-200 ${pathname === href ? 'border-b-2 border-white' : ''} font-sans`}
                  >
                    {name}
                  </Link>
                )).concat([
                  <span
                    key="logout"
                    className="cursor-pointer text-md font-medium hover:text-red-400 font-sans"
                    onClick={() => { authApi.logout(); setIsAuthenticated(false); }}
                  >
                    Logout
                  </span>
                ])
              ) : (
                <Link href="/login" className="text-md font-medium hover:text-yellow-800 font-sans">Login</Link>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="focus:outline-none">
                {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        <Transition
          show={mobileMenuOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 transform -translate-y-2"
          enterTo="opacity-100 transform translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 transform translate-y-0"
          leaveTo="opacity-0 transform -translate-y-2"
        >
          <div className="md:hidden bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-950 text-white light-black:bg-gray-800 px-4 pt-4 pb-6 space-y-2">
            {isAuthenticated ? (
              navLinks.map(({ name, href }) => (
                <Link
                  key={name}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-md font-medium text-white hover:text-yellow-800 transition-colors ${pathname === href ? 'font-semibold underline' : ''} font-sans`}
                >
                  {name}
                </Link>
              )).concat([
                <span
                  key="logout"
                  className="block cursor-pointer text-md font-medium text-red-300 hover:text-red-500 font-sans"
                  onClick={() => { authApi.logout(); setIsAuthenticated(false); setMobileMenuOpen(false); }}
                >
                  Logout
                </span>
              ])
            ) : (
              <Link href="/login" className="block text-md font-medium text-white hover:text-yellow-800 font-sans">Login</Link>
            )}
          </div>
        </Transition>
      </nav>
    </ProtectedRoute>
  );
}