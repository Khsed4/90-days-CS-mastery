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
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateChallengeDto, UpdateChallengeDto } from '../challenges/dto';
import { ReviewChallengeDto, AdminStatsDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Challenge } from '@shared/types';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Get administrative metrics & platform statistics' })
  @ApiResponse({ status: 200, description: 'Admin statistics returned' })
  @Get('stats')
  async getStats(): Promise<AdminStatsDto> {
    return this.adminService.getAdminStats();
  }

  @ApiOperation({ summary: 'Get all challenges with type/status/search filters' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, description: 'Challenges list returned' })
  @Get('challenges')
  async getChallenges(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<Challenge[]> {
    return this.adminService.getAllChallenges({ type, status, search });
  }

  @ApiOperation({ summary: 'Create challenge directly as Admin' })
  @ApiResponse({ status: 201, description: 'Challenge created and auto-approved' })
  @Post('challenges')
  async createChallenge(
    @Body() dto: CreateChallengeDto,
    @Request() req: any,
  ): Promise<Challenge> {
    return this.adminService.createChallenge(dto, req.user);
  }

  @ApiOperation({ summary: 'Update any challenge' })
  @ApiResponse({ status: 200, description: 'Challenge updated' })
  @Put('challenges/:id')
  async updateChallenge(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChallengeDto,
  ): Promise<Challenge> {
    return this.adminService.updateChallenge(id, dto);
  }

  @ApiOperation({ summary: 'Review and approve/reject community challenge' })
  @ApiResponse({ status: 200, description: 'Challenge status updated' })
  @Patch('challenges/:id/status')
  async reviewChallenge(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReviewChallengeDto,
  ): Promise<Challenge> {
    return this.adminService.reviewChallenge(id, dto);
  }

  @ApiOperation({ summary: 'Delete challenge' })
  @ApiResponse({ status: 200, description: 'Challenge deleted' })
  @Delete('challenges/:id')
  async deleteChallenge(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    return this.adminService.deleteChallenge(id);
  }
}
