'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, logout } from '@/lib/auth';
import { getHabits, saveHabits } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/ui/empty';

export default function DashboardPage() {
  const [session, setSession] = useState<{ userId: string; email: string } | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.push('/login');
      return;
    }

    setSession(currentSession);
    const allHabits = getHabits();
    const userHabits = allHabits.filter((h) => h.userId === currentSession.userId);
    setHabits(userHabits);
    setIsLoading(false);
  }, [router]);

  const handleCreateHabit = (newHabit: Habit) => {
    setHabits([...habits, newHabit]);
  };

  const handleUpdateHabit = (updatedHabit: Habit) => {
    setHabits(habits.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)));
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(habits.filter((h) => h.id !== habitId));
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Habit Tracker</h1>
            <p className="text-gray-600 text-sm mt-1">
              Welcome, <span className="font-semibold">{session?.email}</span>
            </p>
          </div>
          <Button
            onClick={handleLogout}
            data-testid="auth-logout-button"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </Button>
        </div>

        {/* Create Habit Form */}
        {session && <HabitForm userId={session.userId} onCreateHabit={handleCreateHabit} />}

        {/* Habits List */}
        {habits.length === 0 ? (
          <Empty
            data-testid="empty-state"
            icon="✨"
            title="No habits yet"
            description="Create your first habit to get started"
          />
        ) : (
          <div className="grid gap-4">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onUpdate={handleUpdateHabit}
                onDelete={handleDeleteHabit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
