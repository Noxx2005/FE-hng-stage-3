'use client';

import { useState } from 'react';
import { validateHabitName } from '@/lib/validators';
import { createHabit } from '@/lib/habit-storage';
import { Habit } from '@/types/habit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, FieldLabel } from '@/components/ui/field';

interface HabitFormProps {
  userId: string;
  onCreateHabit: (habit: Habit) => void;
}

export default function HabitForm({ userId, onCreateHabit }: HabitFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error || 'Invalid habit name');
      return;
    }

    setIsLoading(true);
    try {
      const habit = createHabit(userId, validation.value, description);
      onCreateHabit(habit);
      setName('');
      setDescription('');
      setIsOpen(false);
    } catch (err) {
      setError('Failed to create habit');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        data-testid="create-habit-button"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        + Add Habit
      </Button>
    );
  }

  return (
    <Card className="border-blue-200 bg-white">
      <CardHeader>
        <CardTitle className="text-blue-900">Create New Habit</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} data-testid="habit-form" className="space-y-4">
          <FieldGroup>
            <FieldLabel className="text-gray-700">Habit Name *</FieldLabel>
            <Input
              type="text"
              placeholder="e.g., Drink Water, Exercise"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="habit-name-input"
              className="border-blue-200 focus:border-blue-500"
              required
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel className="text-gray-700">Description</FieldLabel>
            <Textarea
              placeholder="Optional description for your habit"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="habit-description-input"
              className="border-blue-200 focus:border-blue-500"
              rows={3}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel className="text-gray-700">Frequency</FieldLabel>
            <select
              data-testid="habit-frequency-select"
              className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:border-blue-500 bg-white"
              defaultValue="daily"
            >
              <option value="daily">Daily</option>
            </select>
          </FieldGroup>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              data-testid="habit-save-button"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Creating...' : 'Create Habit'}
            </Button>
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
