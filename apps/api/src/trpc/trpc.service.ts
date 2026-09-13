import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as trpcExpress from '@trpc/server/adapters/express';
import { PrismaService } from '../database/prisma.service';
import { AuthService } from '../modules/auth/auth.service';
import { ChallengesService } from '../modules/challenges/challenges.service';
import { ProgressService } from '../modules/progress/progress.service';
import { UsersService } from '../modules/users/users.service';
import { OrganizationsService } from '../modules/organizations/organizations.service';
import { AdminService } from '../modules/admin/admin.service';
import { createAppRouter, AppRouter } from './app.router';
import { createTrpcContextFactory } from './trpc.context';

@Injectable()
export class TrpcService {
  public readonly appRouter: AppRouter;
  public readonly createContext: ReturnType<typeof createTrpcContextFactory>;

  constructor(
    private readonly authService: AuthService,
    private readonly challengesService: ChallengesService,
    private readonly progressService: ProgressService,
    private readonly usersService: UsersService,
    private readonly organizationsService: OrganizationsService,
    private readonly adminService: AdminService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    this.createContext = createTrpcContextFactory(this.jwtService, this.prisma);
    this.appRouter = createAppRouter(
      this.authService,
      this.challengesService,
      this.progressService,
      this.usersService,
      this.organizationsService,
      this.adminService,
      this.prisma,
    );
  }

  getMiddleware() {
    return trpcExpress.createExpressMiddleware({
      router: this.appRouter,
      createContext: this.createContext,
    });
  }
}
