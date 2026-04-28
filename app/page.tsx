'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';
import { getSession } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) return;
    
    const timer = setTimeout(() => {
      const session = getSession();
      const destination = session ? '/dashboard' : '/login';
      // Use replace to avoid adding splash to history
      router.replace(destination);
      setChecked(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [router, checked]);

  return <SplashScreen />;
}
