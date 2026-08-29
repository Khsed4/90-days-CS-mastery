import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { Roles } from '../../../core/decorators/roles.decorator';
import { AdminService } from '../services/admin.service';
import { CreateChallengeDto } from '../../challenges/dto/request/create-challenge.dto';
import { UpdateChallengeDto } from '../../challenges/dto/request/update-challenge.dto';
import { ReviewChallengeDto } from '../dto/request/review-challenge.dto';
import { ChallengeResponseDto } from '../../challenges/dto/response/challenge-response.dto';
import { AdminStatsDto } from '../dto/response/admin-stats.dto';
import { ChallengeType, ChallengeStatus } from '@shared';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  private mapToResponse(entity: any): ChallengeResponseDto {
    return {
      id: entity.id,
      title: entity.title,
      difficulty: entity.difficulty,
      category: entity.category,
      prerequisite: entity.prerequisite,
      description: entity.description,
      examples: entity.examples,
      constraints: entity.constraints,
      java: entity.java,
      ts: entity.ts,
      type: entity.type,
      status: entity.status,
      authorId: entity.authorId,
      authorName: entity.authorName,
      rejectionReason: entity.rejectionReason,
      createdAt: entity.createdAt ? entity.createdAt.toISOString() : undefined,
      updatedAt: entity.updatedAt ? entity.updatedAt.toISOString() : undefined,
    };
  }

  @Get('stats')
  async getStats(): Promise<AdminStatsDto> {
    return this.adminService.getStats();
  }

  @Get('challenges')
  async getChallenges(
    @Query('type') type?: ChallengeType,
    @Query('status') status?: ChallengeStatus,
    @Query('authorId') authorId?: string,
    @Query('search') search?: string,
  ): Promise<ChallengeResponseDto[]> {
    const list = await this.adminService.getAllChallenges({ type, status, authorId, search });
    return list.map((c) => this.mapToResponse(c));
  }

  @Post('challenges')
  async createChallenge(
    @Request() req: any,
    @Body() dto: CreateChallengeDto,
  ): Promise<ChallengeResponseDto> {
    const created = await this.adminService.createChallenge(dto, req.user);
    return this.mapToResponse(created);
  }

  @Put('challenges/:id')
  async updateChallenge(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChallengeDto,
  ): Promise<ChallengeResponseDto> {
    const updated = await this.adminService.updateChallenge(id, dto);
    return this.mapToResponse(updated);
  }

  @Patch('challenges/:id/status')
  async reviewChallenge(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReviewChallengeDto,
  ): Promise<ChallengeResponseDto> {
    const reviewed = await this.adminService.reviewChallenge(id, dto);
    return this.mapToResponse(reviewed);
  }

  @Delete('challenges/:id')
  async deleteChallenge(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean }> {
    const success = await this.adminService.deleteChallenge(id);
    return { success };
  }
}
