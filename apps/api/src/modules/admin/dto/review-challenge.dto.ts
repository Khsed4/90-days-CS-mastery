import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsIn, IsOptional } from 'class-validator';
import { ReviewChallengeRequest } from '@shared/contracts';

export class ReviewChallengeDto implements ReviewChallengeRequest {
  @ApiProperty({ example: 'APPROVED', enum: ['APPROVED', 'REJECTED'], description: 'Moderation action' })
  @IsString()
  @IsIn(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';

  @ApiPropertyOptional({ example: 'Please provide more detailed examples', description: 'Rejection feedback' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
