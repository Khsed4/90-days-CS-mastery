import { z } from 'zod';
import { router, adminProcedure } from '../trpc';
import { AdminService } from '../../modules/admin/admin.service';

export function createAdminRouter(adminService: AdminService) {
  return router({
    stats: adminProcedure.query(async () => {
      return adminService.getAdminStats();
    }),

    users: adminProcedure
      .input(
        z
          .object({
            role: z.string().optional(),
            search: z.string().optional(),
          })
          .optional(),
      )
      .query(async ({ input }) => {
        return adminService.getUsers(input || {});
      }),

    deleteUser: adminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return adminService.deleteUser(input.id);
      }),

    challenges: adminProcedure
      .input(
        z
          .object({
            type: z.string().optional(),
            status: z.string().optional(),
            search: z.string().optional(),
          })
          .optional(),
      )
      .query(async ({ input }) => {
        return adminService.getAllChallenges(input || {});
      }),

    reviewChallenge: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(['APPROVED', 'REJECTED']),
          rejectionReason: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        return adminService.reviewChallenge(input.id, {
          status: input.status,
          rejectionReason: input.rejectionReason,
        });
      }),

    deleteChallenge: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return adminService.deleteChallenge(input.id);
      }),
  });
}
