'use client';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('token');

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
              Authorization: `Bearer ${token}`,
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
