import { describe, it, expect } from 'vitest';
import { getHabitSlug } from '@/lib/slug';

describe('getHabitSlug', () => {
  it('returns lowercase hyphenated slug for a basic habit name', () => {
    expect(getHabitSlug('Drink Water')).toBe('drink-water');
  });

  it('trims outer spaces and collapses repeated internal spaces', () => {
    expect(getHabitSlug('  Exercise   Daily  ')).toBe('exercise-daily');
  });

  it('removes non alphanumeric characters except hyphens', () => {
    expect(getHabitSlug('Read & Learn!')).toBe('read--learn');
  });
});
