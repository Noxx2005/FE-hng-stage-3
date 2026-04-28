'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';
import { getSession } from '@/lib/auth';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
