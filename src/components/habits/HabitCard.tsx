'use client';

import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import { toggleHabitCompletion, updateHabit } from '@/lib/habits';
import { updateHabit as updateHabitStorage, deleteHabit } from '@/lib/habit-storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

interface HabitCardProps {
  habit: Habit;
  onUpdate: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitCard({ habit, onUpdate, onDelete }: HabitCardProps) {
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(habit.name);
  const [editedDesc, setEditedDesc] = useState(habit.description);

  const handleToggleCompletion = () => {
    const updated = toggleHabitCompletion(habit, today);
    updateHabitStorage(updated);
    onUpdate(updated);
  };

  const handleSaveEdit = () => {
    const updated = {
      ...habit,
      name: editedName,
      description: editedDesc,
    };
    updateHabitStorage(updated);
    onUpdate(updated);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteHabit(habit.id);
    onDelete(habit.id);
  };

  return (
    <Card className={`border-2 ${isCompletedToday ? 'border-green-300 bg-green-50' : 'border-blue-200 bg-white'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full mb-2 px-2 py-1 border border-blue-200 rounded text-blue-900 font-semibold"
              />
            ) : (
              <CardTitle className="text-blue-900">{habit.name}</CardTitle>
            )}
            {isEditing ? (
              <textarea
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
                className="w-full px-2 py-1 border border-blue-200 rounded text-sm text-gray-700"
                rows={2}
              />
            ) : (
              <CardDescription className="text-gray-600">{habit.description || 'No description'}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-600">Current Streak</div>
            <div
              data-testid={`habit-streak-${slug}`}
              className="text-2xl font-bold text-blue-600"
            >
              {streak} days
            </div>
          </div>

          <button
            onClick={handleToggleCompletion}
            data-testid={`habit-complete-${slug}`}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              isCompletedToday
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            {isCompletedToday ? '✓ Done' : 'Mark Done'}
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="p-3 bg-red-50 border border-red-200 rounded space-y-2">
            <p className="text-sm text-red-800">Are you sure you want to delete this habit?</p>
            <div className="flex gap-2">
              <Button
                onClick={handleDelete}
                data-testid="confirm-delete-button"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                Delete
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                data-testid={`habit-edit-${slug}`}
                className="flex-1 bg-blue-200 hover:bg-blue-300 text-blue-900 text-sm"
              >
                Edit
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                data-testid={`habit-delete-${slug}`}
                className="flex-1 bg-red-200 hover:bg-red-300 text-red-900 text-sm"
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
