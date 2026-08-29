import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProgressService } from '../services/progress.service';
import { ToggleDayDto } from '../dto/request/toggle-day.dto';
import { UpdateSettingsDto } from '../dto/request/update-settings.dto';
import { SyncProgressDto } from '../dto/request/sync-progress.dto';
import { ProgressResponseDto } from '../dto/response/progress-response.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  private mapToResponse(entity: any): ProgressResponseDto {
    return {
      userId: entity.userId,
      completedDays: entity.completedDays,
      streak: entity.streak,
      interfaceLang: entity.interfaceLang,
      updatedAt: entity.updatedAt ? entity.updatedAt.toISOString() : new Date().toISOString(),
    };
  }

  @Get()
  async getProgress(@Request() req: any): Promise<ProgressResponseDto> {
    const progress = await this.progressService.getProgress(req.user.id);
    return this.mapToResponse(progress);
  }

  @HttpCode(HttpStatus.OK)
  @Post('toggle')
  async toggleDay(@Request() req: any, @Body() dto: ToggleDayDto): Promise<ProgressResponseDto> {
    const progress = await this.progressService.toggleDay(req.user.id, dto.dayId);
    return this.mapToResponse(progress);
  }

  @HttpCode(HttpStatus.OK)
  @Post('settings')
  async updateSettings(
    @Request() req: any,
    @Body() dto: UpdateSettingsDto,
  ): Promise<ProgressResponseDto> {
    const progress = await this.progressService.updateSettings(req.user.id, dto.interfaceLang);
    return this.mapToResponse(progress);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sync')
  async syncProgress(@Request() req: any, @Body() dto: SyncProgressDto): Promise<ProgressResponseDto> {
    const progress = await this.progressService.syncProgress(
      req.user.id,
      dto.completedDays || [],
      dto.interfaceLang,
    );
    return this.mapToResponse(progress);
  }
}
