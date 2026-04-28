'use client';

import { useEffect } from 'react';
import SplashScreen from '@/components/shared/SplashScreen';
import { getSession } from '@/lib/auth';

export default function Home() {
  useEffect(() => {
    // Wait for hydration to complete
    const timer = setTimeout(() => {
      const session = getSession();
      console.log('Session check:', session);
      const destination = session ? '/dashboard' : '/login';
      console.log('Redirecting to:', destination);
      // Use window.location for reliable navigation
      window.location.href = destination;
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return <SplashScreen />;
}
