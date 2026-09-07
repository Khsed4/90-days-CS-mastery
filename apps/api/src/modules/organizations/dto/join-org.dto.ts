import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { JoinOrgRequest } from '@shared/contracts';

export class JoinOrgDto implements JoinOrgRequest {
  @ApiProperty({ example: 'org-invite-token-abc', description: 'Organization invitation token' })
  @IsString()
  @IsNotEmpty({ message: 'Invite token cannot be empty' })
  token: string;
}
