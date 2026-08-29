import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { ChallengesModule } from '../challenges/challenges.module';

@Module({
  imports: [
    ChallengesModule,
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
