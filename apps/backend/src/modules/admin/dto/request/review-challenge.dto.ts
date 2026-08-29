import { IsIn, IsOptional, IsString } from 'class-validator';

export class ReviewChallengeDto {
  @IsIn(['APPROVED', 'REJECTED'], { message: 'Status must be APPROVED or REJECTED' })
  status: 'APPROVED' | 'REJECTED';

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
