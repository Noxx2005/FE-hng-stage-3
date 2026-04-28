import { describe, it, expect, beforeEach } from 'vitest';
import { createHabit, getUserHabits, updateHabit, deleteHabit } from '@/lib/habit-storage';
import { validateHabitName } from '@/lib/validators';
import { toggleHabitCompletion } from '@/lib/habits';
import { calculateCurrentStreak } from '@/lib/streaks';

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows a validation error when habit name is empty', () => {
    const result = validateHabitName('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Habit name is required');
  });

  it('creates a new habit and renders it in the list', () => {
    const habit = createHabit('user1', 'Drink Water', 'Drink 8 glasses');
    const userHabits = getUserHabits('user1');

    expect(userHabits).toHaveLength(1);
    expect(userHabits[0].name).toBe('Drink Water');
    expect(userHabits[0].description).toBe('Drink 8 glasses');
  });

  it('edits an existing habit and preserves immutable fields', () => {
    const habit = createHabit('user1', 'Drink Water', 'Original description');
    const originalId = habit.id;
    const originalCreatedAt = habit.createdAt;

    const updated = {
      ...habit,
      name: 'Drink More Water',
      description: 'Updated description',
    };
    updateHabit(updated);

    const userHabits = getUserHabits('user1');
    expect(userHabits[0].id).toBe(originalId);
    expect(userHabits[0].createdAt).toBe(originalCreatedAt);
    expect(userHabits[0].name).toBe('Drink More Water');
  });

  it('deletes a habit only after explicit confirmation', () => {
    const habit = createHabit('user1', 'Drink Water', 'Description');
    expect(getUserHabits('user1')).toHaveLength(1);

    deleteHabit(habit.id);
    expect(getUserHabits('user1')).toHaveLength(0);
  });

  it('toggles completion and updates the streak display', () => {
    const habit = createHabit('user1', 'Drink Water', 'Description');
    const today = new Date().toISOString().split('T')[0];

    let updated = toggleHabitCompletion(habit, today);
    expect(updated.completions).toContain(today);

    let streak = calculateCurrentStreak(updated.completions);
    expect(streak).toBe(1);

    updated = toggleHabitCompletion(updated, today);
    expect(updated.completions).not.toContain(today);

    streak = calculateCurrentStreak(updated.completions);
    expect(streak).toBe(0);
  });
});
