'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace('/dashboard');
      return;
    }
    setIsReady(true);
  }, [router]);

  if (!isReady) {
    return null;
  }

  return <LoginForm />;
}
