import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { ChallengesController } from './controllers/challenges.controller';
import { ChallengesService } from './services/challenges.service';
import { CHALLENGE_REPOSITORY } from './repositories/challenge.repository.interface';
import { MysqlChallengeRepository } from './repositories/mysql-challenge.repository';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ChallengesController],
  providers: [
    ChallengesService,
    {
      provide: CHALLENGE_REPOSITORY,
      useClass: MysqlChallengeRepository,
    },
  ],
  exports: [ChallengesService, CHALLENGE_REPOSITORY],
})
export class ChallengesModule {}
