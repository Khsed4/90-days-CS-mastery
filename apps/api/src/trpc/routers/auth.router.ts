import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { AuthService } from '../../modules/auth/auth.service';
import { PrismaService } from '../../database/prisma.service';

export function createAuthRouter(authService: AuthService, prisma: PrismaService) {
  return router({
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        return authService.login(input as any);
      }),

    register: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(6),
          name: z.string().min(1),
          inviteToken: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        return authService.register(input as any);
      }),

    registerOrganization: publicProcedure
      .input(
        z.object({
          organizationName: z.string().min(1),
          name: z.string().min(1),
          email: z.string().email(),
          password: z.string().min(6),
          allowedLanguages: z.array(z.any()).optional(),
          allowedCategories: z.array(z.string()).optional(),
        }),
      )
      .mutation(async ({ input }) => {
        return authService.registerOrganization(input as any);
      }),

    sendVerificationCode: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
        }),
      )
      .mutation(async ({ input }) => {
        return authService.sendVerificationCode(input.email);
      }),

    verifyCode: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          code: z.string().min(6),
        }),
      )
      .mutation(async ({ input }) => {
        return authService.verifyCode(input.email, input.code);
      }),

    me: protectedProcedure.query(async ({ ctx }) => {
      const user = await prisma.user.findUnique({
        where: { id: ctx.user.id },
        include: {
          organization: true,
          ownedOrg: true,
          progress: true,
        },
      });
      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        organizationId: user.organizationId,
        organizationName: user.organization?.name || user.ownedOrg?.name || null,
        selectedLanguage: (user as any).selectedLanguage || 'typescript',
      };
    }),
  });
}
