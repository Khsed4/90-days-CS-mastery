import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { SyncProgressDto, UpdateSettingsDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserProgress } from '@shared/types';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @ApiOperation({ summary: 'Get current user progress and streak' })
  @ApiResponse({ status: 200, description: 'User progress returned' })
  @Get()
  async getProgress(@Request() req: any): Promise<UserProgress> {
    return this.progressService.getProgress(req.user.id);
  }

  @ApiOperation({ summary: 'Toggle completion status of a challenge day' })
  @ApiBody({ schema: { type: 'object', properties: { dayId: { type: 'number', example: 1 } } } })
  @ApiResponse({ status: 200, description: 'Updated user progress' })
  @Post('toggle')
  async toggleDay(
    @Request() req: any,
    @Body('dayId') dayId: number,
  ): Promise<UserProgress> {
    return this.progressService.toggleDay(req.user.id, dayId);
  }

  @ApiOperation({ summary: 'Update interface language preference' })
  @ApiResponse({ status: 200, description: 'Updated settings' })
  @Post('settings')
  async updateSettings(
    @Request() req: any,
    @Body() dto: UpdateSettingsDto,
  ): Promise<UserProgress> {
    return this.progressService.updateSettings(req.user.id, dto.interfaceLang);
  }

  @ApiOperation({ summary: 'Sync local guest progress to authenticated account' })
  @ApiResponse({ status: 200, description: 'Progress synced successfully' })
  @Post('sync')
  async syncProgress(
    @Request() req: any,
    @Body() dto: SyncProgressDto,
  ): Promise<UserProgress> {
    return this.progressService.syncProgress(req.user.id, dto);
  }
}
