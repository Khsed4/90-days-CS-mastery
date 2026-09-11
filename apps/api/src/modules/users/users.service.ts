import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateUserPreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private parseJsonArray(json: string | null | undefined): string[] | null {
    if (!json) return null;
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  async updatePreferences(userId: string, dto: UpdateUserPreferencesDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
        ownedOrg: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const org = user.organization || user.ownedOrg;

    if (org) {
      const allowedLangs = this.parseJsonArray(org.allowedLanguages);
      if (allowedLangs && allowedLangs.length > 0 && dto.selectedLanguage) {
        if (!allowedLangs.includes(dto.selectedLanguage)) {
          throw new BadRequestException(
            `Language "${dto.selectedLanguage}" is not permitted by your organization (${org.name}). Allowed: ${allowedLangs.join(', ')}`,
          );
        }
      }

      const allowedCats = this.parseJsonArray(org.allowedCategories);
      if (allowedCats && allowedCats.length > 0 && dto.selectedCategories && dto.selectedCategories.length > 0) {
        const invalid = dto.selectedCategories.filter(cat => !allowedCats.includes(cat));
        if (invalid.length > 0) {
          throw new BadRequestException(
            `Categories [${invalid.join(', ')}] are not permitted by your organization (${org.name}).`,
          );
        }
      }
    }

    const dataToUpdate: any = {};
    if (dto.selectedLanguage !== undefined) {
      dataToUpdate.selectedLanguage = dto.selectedLanguage;
    }
    if (dto.selectedCategories !== undefined) {
      dataToUpdate.selectedCategories = JSON.stringify(dto.selectedCategories);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    return {
      success: true,
      selectedLanguage: updated.selectedLanguage,
      selectedCategories: this.parseJsonArray(updated.selectedCategories),
    };
  }

  async getPreferences(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
        ownedOrg: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const org = user.organization || user.ownedOrg;

    return {
      selectedLanguage: (user as any).selectedLanguage || 'typescript',
      selectedCategories: this.parseJsonArray((user as any).selectedCategories),
      allowedLanguages: org ? this.parseJsonArray(org.allowedLanguages) : null,
      allowedCategories: org ? this.parseJsonArray(org.allowedCategories) : null,
      organizationName: org ? org.name : null,
    };
  }
}
