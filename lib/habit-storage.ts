import { Habit } from '@/types/habit';

const HABITS_KEY = 'habit-tracker-habits';

export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function getUserHabits(userId: string): Habit[] {
  return getHabits().filter((h) => h.userId === userId);
}

export function createHabit(
  userId: string,
  name: string,
  description: string
): Habit {
  const habit: Habit = {
    id: Math.random().toString(36).slice(2),
    userId,
    name,
    description,
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    completions: [],
  };

  const habits = getHabits();
  saveHabits([...habits, habit]);

  return habit;
}

export function updateHabit(habit: Habit): Habit {
  const habits = getHabits();
  const index = habits.findIndex((h) => h.id === habit.id);

  if (index === -1) {
    throw new Error('Habit not found');
  }

  habits[index] = habit;
  saveHabits(habits);

  return habit;
}

export function deleteHabit(habitId: string): void {
  const habits = getHabits();
  saveHabits(habits.filter((h) => h.id !== habitId));
}
