export class ProgressEntity {
  id: string;
  userId: string;
  completedDays: number[];
  streak: number;
  interfaceLang: 'en' | 'fa' | 'ps';
  updatedAt: Date;

  constructor(partial: Partial<ProgressEntity>) {
    Object.assign(this, partial);
    if (!this.completedDays) {
      this.completedDays = [];
    }
  }

  calculateStreak(): number {
    let currentStreak = 0;
    const daySet = new Set(this.completedDays);
    for (let i = 1; i <= 90; i++) {
      if (daySet.has(i)) {
        currentStreak++;
      } else {
        break;
      }
    }
    this.streak = currentStreak;
    return currentStreak;
  }
}
