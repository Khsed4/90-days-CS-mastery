import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { ChallengesService } from '../../modules/challenges/challenges.service';
import { PrismaService } from '../../database/prisma.service';

export function createChallengesRouter(challengesService: ChallengesService, prisma: PrismaService) {
  return router({
    allCore: publicProcedure.query(async () => {
      return challengesService.findAllCore();
    }),

    bonus: publicProcedure.query(async ({ ctx }) => {
      return challengesService.findBonusChallenges(ctx.user ?? undefined);
    }),

    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        return challengesService.findOne(input.id, ctx.user ?? undefined);
      }),

    mySubmissions: protectedProcedure.query(async ({ ctx }) => {
      return challengesService.findUserSubmissions(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
          category: z.string().min(1),
          prerequisite: z.string().default('None'),
          description: z.string().min(1),
          examples: z.string().default('[]'),
          constraints: z.string().default('[]'),
          java: z.string().default(''),
          ts: z.string().default(''),
          type: z.enum(['CORE', 'BONUS']).default('BONUS'),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const user = await prisma.user.findUnique({
          where: { id: ctx.user.id },
          select: { id: true, name: true, role: true, organizationId: true },
        });
        if (!user) throw new Error('User not found');
        return challengesService.createChallenge(input as any, user);
      }),
  });
}
