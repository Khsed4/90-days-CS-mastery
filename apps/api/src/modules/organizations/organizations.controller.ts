import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { OrganizationsService } from './organizations.service';
import { CreateInviteDto, JoinOrgDto } from './dto';
import {
  OrgOverviewResponse,
  OrgMembersResponse,
  OrgMemberProgressResponse,
} from '@shared/contracts';
import { OrganizationInvite } from '@shared/types';
import { Role } from '@prisma/client';

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
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
}
