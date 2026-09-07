export function calculateStreak(completedDays: number[]): number {
  let streak = 0;
  const daySet = new Set(completedDays);
  for (let i = 1; i <= 90; i++) {
    if (daySet.has(i)) streak++;
    else break;
  }
  return streak;
}

export function isTrialDay(dayId: number): boolean {
  return dayId >= 1 && dayId <= 3;
}
