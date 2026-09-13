import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { ProgressService } from '../../modules/progress/progress.service';
import { UsersService } from '../../modules/users/users.service';

export function createProgressRouter(progressService: ProgressService, usersService: UsersService) {
  return router({
    myProgress: protectedProcedure.query(async ({ ctx }) => {
      return progressService.getProgress(ctx.user.id);
    }),

    toggleDay: protectedProcedure
      .input(z.object({ dayId: z.number().min(1).max(90) }))
      .mutation(async ({ input, ctx }) => {
        return progressService.toggleDay(ctx.user.id, input.dayId);
      }),

    sync: protectedProcedure
      .input(
        z.object({
          completedDays: z.array(z.number()),
          interfaceLang: z.string().optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        return progressService.syncProgress(ctx.user.id, input as any);
      }),

    updateSettings: protectedProcedure
      .input(
        z.object({
          interfaceLang: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        return progressService.updateSettings(ctx.user.id, input.interfaceLang as any);
      }),

    preferences: protectedProcedure.query(async ({ ctx }) => {
      return usersService.getPreferences(ctx.user.id);
    }),

    updatePreferences: protectedProcedure
      .input(
        z.object({
          selectedLanguage: z.string().optional(),
          selectedCategories: z.array(z.string()).optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        return usersService.updatePreferences(ctx.user.id, input as any);
      }),
  });
}
