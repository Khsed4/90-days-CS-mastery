import { IsEmail } from 'class-validator';

export class SendCodeDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
