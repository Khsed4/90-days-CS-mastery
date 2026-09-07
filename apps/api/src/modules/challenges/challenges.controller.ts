import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Challenge } from '@shared/types';

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @ApiOperation({ summary: 'Get all approved core curriculum challenges (Days 1 to 90)' })
  @ApiResponse({ status: 200, description: 'Core challenges list' })
  @Get()
  async getCoreChallenges(): Promise<Challenge[]> {
    return this.challengesService.findAllCore();
  }

  @ApiOperation({ summary: 'Get community bonus challenges' })
  @ApiResponse({ status: 200, description: 'Bonus challenges list' })
  @Get('bonus')
  async getBonusChallenges(@Request() req: any): Promise<Challenge[]> {
    const userId = req.user?.id;
    return this.challengesService.findBonusChallenges(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user submitted bonus challenges' })
  @ApiResponse({ status: 200, description: 'User submissions' })
  @UseGuards(JwtAuthGuard)
  @Get('my-submissions')
  async getMySubmissions(@Request() req: any): Promise<Challenge[]> {
    return this.challengesService.findUserSubmissions(req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a new bonus challenge' })
  @ApiResponse({ status: 201, description: 'Challenge created' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createChallenge(
    @Body() dto: CreateChallengeDto,
    @Request() req: any,
  ): Promise<Challenge> {
    return this.challengesService.createChallenge(dto, req.user);
  }

  @ApiOperation({ summary: 'Get challenge by ID' })
  @ApiResponse({ status: 200, description: 'Challenge details' })
  @ApiResponse({ status: 404, description: 'Challenge not found' })
  @Get(':id')
  async getChallengeById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<Challenge> {
    return this.challengesService.findOne(id, req.user);
  }
}
