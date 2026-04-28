'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';
import { getSession } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getSession();
      const destination = session ? '/dashboard' : '/login';
      router.replace(destination);
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
