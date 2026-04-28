'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, FieldLabel } from '@/components/ui/field';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const result = signup(email, password);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Signup failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-4">
      <Card className="w-full max-w-md border-blue-200 bg-white">
        <CardHeader className="space-y-2">
          <CardTitle className="text-blue-900">Create Account</CardTitle>
          <CardDescription className="text-gray-600">Sign up to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <FieldLabel className="text-gray-700">Email</FieldLabel>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="auth-signup-email"
                className="border-blue-200 focus:border-blue-500"
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel className="text-gray-700">Password</FieldLabel>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="auth-signup-password"
                className="border-blue-200 focus:border-blue-500"
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel className="text-gray-700">Confirm Password</FieldLabel>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-blue-200 focus:border-blue-500"
                required
              />
            </FieldGroup>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <Button
              type="submit"
              disabled={isLoading}
              data-testid="auth-signup-submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
