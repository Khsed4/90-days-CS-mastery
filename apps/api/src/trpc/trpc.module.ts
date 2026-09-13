import { Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { AuthModule } from '../modules/auth/auth.module';
import { ChallengesModule } from '../modules/challenges/challenges.module';
import { ProgressModule } from '../modules/progress/progress.module';
import { UsersModule } from '../modules/users/users.module';
import { OrganizationsModule } from '../modules/organizations/organizations.module';
import { AdminModule } from '../modules/admin/admin.module';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [
    AuthModule,
    ChallengesModule,
    ProgressModule,
    UsersModule,
    OrganizationsModule,
    AdminModule,
    PrismaModule,
  ],
  providers: [TrpcService],
  exports: [TrpcService],
})
export class TrpcModule {}
