import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserPreferencesDto } from './dto/update-preferences.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current user preferences and organization constraints' })
  @ApiResponse({ status: 200, description: 'User preferences' })
  @Get('preferences')
  async getPreferences(@Request() req: any) {
    return this.usersService.getPreferences(req.user.id);
  }

  @ApiOperation({ summary: 'Update active programming language and category filters' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
  @ApiResponse({ status: 400, description: 'Requested language or category not permitted by organization' })
  @Put('preferences')
  async updatePreferences(@Request() req: any, @Body() dto: UpdateUserPreferencesDto) {
    return this.usersService.updatePreferences(req.user.id, dto);
  }
}
