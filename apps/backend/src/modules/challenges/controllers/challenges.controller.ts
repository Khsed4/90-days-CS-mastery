import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChallengesService } from '../services/challenges.service';
import { CreateChallengeDto } from '../dto/request/create-challenge.dto';
import { ChallengeResponseDto } from '../dto/response/challenge-response.dto';

@Controller('challenges')
export class ChallengesController {
  constructor(private challengesService: ChallengesService) {}

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

  @Get()
  async findCore(): Promise<ChallengeResponseDto[]> {
    const list = await this.challengesService.findAllCore();
    return list.map((c) => this.mapToResponse(c));
  }

  @Get('bonus')
  async findBonus(): Promise<ChallengeResponseDto[]> {
    const list = await this.challengesService.findBonusChallenges();
    return list.map((c) => this.mapToResponse(c));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-submissions')
  async findMySubmissions(@Request() req: any): Promise<ChallengeResponseDto[]> {
    const list = await this.challengesService.findUserSubmissions(req.user.id);
    return list.map((c) => this.mapToResponse(c));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Request() req: any,
    @Body() dto: CreateChallengeDto,
  ): Promise<ChallengeResponseDto> {
    const created = await this.challengesService.createChallenge(dto, req.user);
    return this.mapToResponse(created);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<ChallengeResponseDto> {
    const challenge = await this.challengesService.findOne(id, req.user);
    return this.mapToResponse(challenge);
  }
}
