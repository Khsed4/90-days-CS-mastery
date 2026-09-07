import { ApiProperty } from '@nestjs/swagger';
import { AdminStatsResponse } from '@shared/contracts';

export class AdminStatsDto implements AdminStatsResponse {
  @ApiProperty({ example: 120 })
  totalUsers: number;

  @ApiProperty({ example: 95 })
  totalChallenges: number;

  @ApiProperty({ example: 90 })
  coreChallenges: number;

  @ApiProperty({ example: 5 })
  bonusChallenges: number;

  @ApiProperty({ example: 2 })
  pendingChallenges: number;

  @ApiProperty({ example: 450 })
  totalCompletions: number;
}
