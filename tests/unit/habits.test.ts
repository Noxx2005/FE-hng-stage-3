import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import { Habit } from '@/types/habit';

describe('toggleHabitCompletion', () => {
  const mockHabit: Habit = {
    id: '1',
    userId: 'user1',
    name: 'Drink Water',
    description: 'Drink 8 glasses of water',
    frequency: 'daily',
    createdAt: '2024-01-01T00:00:00Z',
    completions: ['2024-01-15', '2024-01-14'],
  };

  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(mockHabit, '2024-01-16');
    expect(result.completions).toContain('2024-01-16');
    expect(result.completions).toHaveLength(3);
  });

  it('removes a completion date when the date already exists', () => {
    const result = toggleHabitCompletion(mockHabit, '2024-01-15');
    expect(result.completions).not.toContain('2024-01-15');
    expect(result.completions).toHaveLength(1);
  });

  it('does not mutate the original habit object', () => {
    const original = { ...mockHabit };
    toggleHabitCompletion(mockHabit, '2024-01-16');
    expect(mockHabit).toEqual(original);
  });

  it('does not return duplicate completion dates', () => {
    const habitWithDuplicates: Habit = {
      ...mockHabit,
      completions: ['2024-01-15', '2024-01-15', '2024-01-14'],
    };
    const result = toggleHabitCompletion(habitWithDuplicates, '2024-01-13');
    const uniqueCompletions = new Set(result.completions);
    expect(uniqueCompletions.size).toBe(result.completions.length);
  });
});
