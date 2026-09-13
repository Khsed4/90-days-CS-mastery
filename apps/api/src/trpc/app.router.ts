import { router } from './trpc';
import { createAuthRouter } from './routers/auth.router';
import { createChallengesRouter } from './routers/challenges.router';
import { createProgressRouter } from './routers/progress.router';
import { createOrganizationsRouter } from './routers/organizations.router';
import { createAdminRouter } from './routers/admin.router';
import { AuthService } from '../modules/auth/auth.service';
import { ChallengesService } from '../modules/challenges/challenges.service';
import { ProgressService } from '../modules/progress/progress.service';
import { UsersService } from '../modules/users/users.service';
import { OrganizationsService } from '../modules/organizations/organizations.service';
import { AdminService } from '../modules/admin/admin.service';
import { PrismaService } from '../database/prisma.service';

export function createAppRouter(
  authService: AuthService,
  challengesService: ChallengesService,
  progressService: ProgressService,
  usersService: UsersService,
  organizationsService: OrganizationsService,
  adminService: AdminService,
  prisma: PrismaService,
) {
  return router({
    auth: createAuthRouter(authService, prisma),
    challenges: createChallengesRouter(challengesService, prisma),
    progress: createProgressRouter(progressService, usersService),
    organizations: createOrganizationsRouter(organizationsService),
    admin: createAdminRouter(adminService),
  });
}

export type AppRouter = ReturnType<typeof createAppRouter>;
