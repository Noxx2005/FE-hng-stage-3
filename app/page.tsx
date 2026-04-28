'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Set a timeout to transition after showing splash screen
    const timer = setTimeout(() => {
      // Middleware will handle the actual redirect based on session
      router.push('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
