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
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { OrganizationsService } from './organizations.service';
import { CreateInviteDto, JoinOrgDto } from './dto';
import {
  OrgOverviewResponse,
  OrgMembersResponse,
  OrgMemberProgressResponse,
  OrgReviewChallengeRequest,
  UpdateOrgCurriculumRequest,
} from '@shared/contracts';
import { Challenge, OrganizationInvite } from '@shared/types';
import { Role } from '@prisma/client';

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @ApiOperation({ summary: 'Get current organization overview and aggregated metrics' })
  @ApiResponse({ status: 200, description: 'Organization stats returned' })
  @Roles(Role.ORGANIZATION, Role.ADMIN)
  @Get('overview')
  async getOverview(@Request() req: any): Promise<OrgOverviewResponse> {
    return this.organizationsService.getOverview(req.user.id);
  }

  @ApiOperation({ summary: 'Get organization members with progress summaries' })
  @ApiQuery({ name: 'search', required: false, description: 'Filter by member name or email' })
  @ApiResponse({ status: 200, description: 'Organization members returned' })
  @Roles(Role.ORGANIZATION, Role.ADMIN)
  @Get('members')
  async getMembers(
    @Request() req: any,
    @Query('search') search?: string,
  ): Promise<OrgMembersResponse> {
    return this.organizationsService.getMembers(req.user.id, search);
  }

  @ApiOperation({ summary: 'Get detailed challenge progress for a specific member' })
  @ApiResponse({ status: 200, description: 'Member progress returned' })
  @Roles(Role.ORGANIZATION, Role.ADMIN)
  @Get('members/:memberId/progress')
  async getMemberProgress(
    @Request() req: any,
    @Param('memberId') memberId: string,
  ): Promise<OrgMemberProgressResponse> {
    return this.organizationsService.getMemberProgress(req.user.id, memberId);
  }

  @ApiOperation({ summary: 'Remove a member from the organization' })
  @ApiResponse({ status: 200, description: 'Member detached from organization' })
  @Roles(Role.ORGANIZATION, Role.ADMIN)
  @Delete('members/:memberId')
  async removeMember(
    @Request() req: any,
    @Param('memberId') memberId: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.organizationsService.removeMember(req.user.id, memberId);
  }

  @ApiOperation({ summary: 'Create a new shareable organization invitation link' })
  @ApiResponse({ status: 201, description: 'Invite link created successfully' })
  @Roles(Role.ORGANIZATION, Role.ADMIN)
  @Post('invites')
  async createInvite(
    @Request() req: any,
    @Body() dto: CreateInviteDto,
  ): Promise<OrganizationInvite> {
    return this.organizationsService.createInvite(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Get all active organization invite links' })
  @ApiResponse({ status: 200, description: 'Active invite links returned' })
  @Roles(Role.ORGANIZATION, Role.ADMIN)
  @Get('invites')
  async getInvites(@Request() req: any): Promise<OrganizationInvite[]> {
    return this.organizationsService.getInvites(req.user.id);
  }

  @ApiOperation({ summary: 'Revoke an organization invitation link' })
  @ApiResponse({ status: 200, description: 'Invite link revoked' })
  @Roles(Role.ORGANIZATION, Role.ADMIN)
  @Delete('invites/:inviteId')
  async revokeInvite(
    @Request() req: any,
    @Param('inviteId') inviteId: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.organizationsService.revokeInvite(req.user.id, inviteId);
  }

  @ApiOperation({ summary: 'Join an organization using an invitation token' })
  @ApiResponse({ status: 200, description: 'Successfully joined organization' })
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @Post('join')
  async joinOrganization(
    @Request() req: any,
    @Body() dto: JoinOrgDto,
  ): Promise<{ success: boolean; organizationName: string }> {
    return this.organizationsService.joinOrganization(req.user.id, dto.token);
  }

  // ==========================================
  // Team Challenge Moderation
  // ==========================================

  @ApiOperation({ summary: 'Get all bonus challenges submitted by organization members for moderation' })
  @ApiResponse({ status: 200, description: 'Organization challenges returned' })
  @Roles(Role.ORGANIZATION, Role.ADMIN)
  @Get('challenges')
  async getOrgChallenges(@Request() req: any): Promise<Challenge[]> {
    return this.organizationsService.getOrgChallenges(req.user.id);
  }

  @ApiOperation({ summary: 'Approve or reject a member-submitted bonus challenge' })
  @ApiResponse({ status: 200, description: 'Challenge reviewed successfully' })
  @Roles(Role.ORGANIZATION, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Patch('challenges/:id/review')
  async reviewOrgChallenge(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { status: 'ORG_APPROVED' | 'REJECTED'; rejectionReason?: string },
  ): Promise<Challenge> {
    return this.organizationsService.reviewOrgChallenge(req.user.id, id, dto);
  }

  // ==========================================
  // Curriculum Settings
  // ==========================================

  @ApiOperation({ summary: 'Update organization curriculum languages and categories' })
  @ApiResponse({ status: 200, description: 'Curriculum settings updated' })
  @Roles(Role.ORGANIZATION, Role.ADMIN)
  @Put('curriculum')
  async updateCurriculum(
    @Request() req: any,
    @Body() dto: UpdateOrgCurriculumRequest,
  ): Promise<{ success: boolean; allowedLanguages: string[]; allowedCategories: string[] }> {
    return this.organizationsService.updateCurriculumSettings(req.user.id, dto);
  }
}
