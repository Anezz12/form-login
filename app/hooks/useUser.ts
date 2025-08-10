'use client';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const tokenType = sessionStorage.getItem('token_type') || 'bearer';

        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + '/user',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${tokenType} ${token}`,
              Accept: 'application/json',
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            sessionStorage.clear();
            window.location.href = '/';
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        setUser(userData.user || userData);
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { user, loading, error };
}
