'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UserCard from '@/components/UserCard';
import Image from 'next/image';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);

    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (token) {
        try {
          const res = await fetch('http://localhost:8000/api/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
          console.log(res);

          if (res.ok) {
            console.log('API logout successful');
          } else {
            console.log('API logout failed, continuing with local logout');
          }
        } catch (apiError) {
          console.log(
            'API logout error, continuing with local logout:',
            apiError
          );
        }
      }

      // Hapus cookie token
      document.cookie = 'token=; path=/; max-age=0';
      sessionStorage.clear();

      console.log('Cookie and sessionStorage cleared');
      router.push('/signup');
    } catch (error) {
      console.error('Logout error:', error);
      document.cookie = 'token=; path=/; max-age=0';
      sessionStorage.clear();
      router.push('/signup');
    } finally {
      setLoading(false);
    }
  };
  // ...existing code...
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Image
                  className="h-8 w-8 rounded-full"
                  src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff"
                  alt="Profile"
                  height={32}
                  width={32}
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Welcome, User!
                </span>
              </div>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging out...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            User Info
          </h2>
          <UserCard />
        </div>
      </main>
    </div>
  );
}
