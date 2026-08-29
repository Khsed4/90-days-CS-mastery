import { Module } from '@nestjs/common';
import { ProgressController } from './controllers/progress.controller';
import { ProgressService } from './services/progress.service';
import { PROGRESS_REPOSITORY } from './repositories/progress.repository.interface';
import { MysqlProgressRepository } from './repositories/mysql-progress.repository';

@Module({
  controllers: [ProgressController],
  providers: [
    ProgressService,
    {
      provide: PROGRESS_REPOSITORY,
      useClass: MysqlProgressRepository,
    },
  ],
  exports: [ProgressService, PROGRESS_REPOSITORY],
})
export class ProgressModule {}
