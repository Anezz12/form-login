'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GitHubCallback() {
  const [status, setStatus] = useState('Processing OAuth callback...');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code) {
        setStatus('❌ No authorization code found');
        setIsLoading(false);
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      try {
        setStatus('🔄 Exchanging code for access token...');

        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + '/auth/github/exchange',
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

            // Store tokens in sessionStorage
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
          }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto h-16 w-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
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
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            )}
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          GitHub Authentication
        </h2>
        <p className="text-gray-600 mb-4">{status}</p>

        {!isLoading && (
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Return to Login
          </button>
        )}
      </div>
    </div>
  );
}
