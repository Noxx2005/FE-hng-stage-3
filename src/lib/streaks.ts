export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayDate = today || new Date().toISOString().split('T')[0];
  const unique = Array.from(new Set(completions)).sort().reverse();

  if (!unique.includes(todayDate)) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date(todayDate);

  for (const completion of unique) {
    const completionDate = new Date(completion);
    if (
      currentDate.toISOString().split('T')[0] === completion
    ) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
