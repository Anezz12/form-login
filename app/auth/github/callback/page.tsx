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
}
