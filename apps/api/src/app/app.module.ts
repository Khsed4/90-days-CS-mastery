import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../database/prisma.module';
import { AuthModule } from '../modules/auth/auth.module';
import { ChallengesModule } from '../modules/challenges/challenges.module';
import { ProgressModule } from '../modules/progress/progress.module';
import { AdminModule } from '../modules/admin/admin.module';
import { OrganizationsModule } from '../modules/organizations/organizations.module';
import { MailModule } from '../modules/mail/mail.module';
import { validate } from '../config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    PrismaModule,
    AuthModule,
    ChallengesModule,
    ProgressModule,
    AdminModule,
    OrganizationsModule,
    MailModule,
  ],
})
export class AppModule {}
