'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) {
      // If already logged in, redirect to dashboard
      router.replace('/dashboard');
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return <SignupForm />;
}
