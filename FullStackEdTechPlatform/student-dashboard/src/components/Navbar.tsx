'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Courses', href: '/courses' },
  { name: 'Login', href: '/auth/login' },
  { name: 'Sign Up', href: '/auth/signup' },
];

export default function Navbar() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('userName');
      console.log('Navbar localStorage token:', token);
      console.log('Navbar localStorage userName:', name);
      if (token && name) {
        setUser({ name });
      } else {
        setUser(null);
      }
    }
  }, [pathname]);

  useEffect(() => {
    console.log('Navbar user state:', user);
  }, [user]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUser(null);
    window.location.href = '/';
  }

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <Link href="/" className="flex flex-shrink-0 items-center">
                  <span className="text-2xl font-bold text-blue-600">360WorldEducation</span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
                <Link href="/courses" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600">Courses</Link>
                {!user && <Link href="/auth/login" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600">Login</Link>}
                {!user && <Link href="/auth/signup" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600">Sign Up</Link>}
                {user && (
                  <div className="relative flex items-center">
                    <button
                      className="flex items-center gap-2 focus:outline-none"
                      onClick={() => setShowDropdown((prev) => !prev)}
                      aria-label="User menu"
                    >
                      <UserCircleIcon className="h-8 w-8 text-blue-600" />
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                        <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>
                          Dashboard
                        </Link>
                        <button
                          onClick={() => { setShowDropdown(false); handleLogout(); }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <Link href="/courses" className="block py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">Courses</Link>
              {!user && <Link href="/auth/login" className="block py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">Login</Link>}
              {!user && <Link href="/auth/signup" className="block py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">Sign Up</Link>}
              {user && (
                <>
                  <Link href="/dashboard" className="block py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">Dashboard</Link>
                  <button onClick={handleLogout} className="block w-full text-left py-2 pl-3 pr-4 text-base font-medium text-red-600 hover:bg-gray-50 hover:text-red-800">Logout</button>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
