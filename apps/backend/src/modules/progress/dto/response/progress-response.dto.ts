export class ProgressResponseDto {
  userId: string;
  completedDays: number[];
  streak: number;
  interfaceLang: 'en' | 'fa' | 'ps';
  updatedAt?: string;
}
