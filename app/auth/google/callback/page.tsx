'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleCallback() {
  const [status, setStatus] = useState('Processing OAuth callback...');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      console.log('OAuth Callback received:', {
        code: code?.substring(0, 20) + '...',
        state,
      });

      if (!code) {
        setStatus('❌ No authorization code found');
        setIsLoading(false);
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      try {
        setStatus('🔄 Exchanging code for access token...');

        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + '/auth/google/exchange',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              code: code,
              state: state,
            }),
          }
        );

        console.log('Exchange response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Exchange successful:', data);

          if (data.status === 'success' && data.authorization) {
            setStatus('✅ Login successful! Storing credentials...');

            // Store tokens di sessionStorage
            sessionStorage.setItem('token', data.authorization.token);
            sessionStorage.setItem(
              'token_type',
              data.authorization.type || 'bearer'
            );
            sessionStorage.setItem(
              'expires_in',
              data.authorization.expires_in?.toString() || '3600'
            );

            // Store user data
            if (data.user) {
              sessionStorage.setItem('user', JSON.stringify(data.user));
            }

            setStatus('🎉 Redirecting to dashboard...');

            // Redirect to user dashboard
            setTimeout(() => {
              router.push('/user');
            }, 1500);
          } else {
            setStatus(`❌ Login failed: ${data.message || 'Unknown error'}`);
            setIsLoading(false);
            setTimeout(() => router.push('/'), 3000);
          }
        } else {
          const errorData = await response.json();
          console.error('Exchange failed:', errorData);
          setStatus(
            `❌ Authentication failed: ${errorData.message || 'Server error'}`
          );
          setIsLoading(false);
          setTimeout(() => router.push('/'), 3000);
        }
      } catch (error) {
        console.error('Error during OAuth callback:', error);
        setStatus('❌ Authentication failed. Please try again.');
        setIsLoading(false);
        setTimeout(() => router.push('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
            {isLoading ? (
              <svg
                className="animate-spin h-8 w-8 text-white"
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
            ) : (
              <svg
                className="h-8 w-8 text-white"
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
            )}
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Google Authentication
        </h2>
        <p className="text-gray-600 mb-4">{status}</p>

        {!isLoading && (
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Login
          </button>
        )}
      </div>
    </div>
  );
}
