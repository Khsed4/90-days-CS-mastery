import { z } from 'zod';
import { router, protectedProcedure, orgProcedure } from '../trpc';
import { OrganizationsService } from '../../modules/organizations/organizations.service';

export function createOrganizationsRouter(organizationsService: OrganizationsService) {
  return router({
    overview: orgProcedure.query(async ({ ctx }) => {
      return organizationsService.getOverview(ctx.user.id);
    }),

    members: orgProcedure
      .input(
        z
          .object({
            search: z.string().optional(),
          })
          .optional(),
      )
      .query(async ({ input, ctx }) => {
        return organizationsService.getMembers(ctx.user.id, input?.search);
      }),

    memberProgress: orgProcedure
      .input(z.object({ memberId: z.string() }))
      .query(async ({ input, ctx }) => {
        return organizationsService.getMemberProgress(ctx.user.id, input.memberId);
      }),

    removeMember: orgProcedure
      .input(z.object({ memberId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        return organizationsService.removeMember(ctx.user.id, input.memberId);
      }),

    createInvite: orgProcedure
      .input(
        z.object({
          email: z.string().email().optional(),
          maxUses: z.number().int().min(0).optional(),
          expiresInDays: z.number().int().min(1).optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        return organizationsService.createInvite(ctx.user.id, input as any);
      }),

    invites: orgProcedure.query(async ({ ctx }) => {
      return organizationsService.getInvites(ctx.user.id);
    }),

    revokeInvite: orgProcedure
      .input(z.object({ inviteId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        return organizationsService.revokeInvite(ctx.user.id, input.inviteId);
      }),

    join: protectedProcedure
      .input(z.object({ token: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        return organizationsService.joinOrganization(ctx.user.id, input.token);
      }),

    challenges: orgProcedure.query(async ({ ctx }) => {
      return organizationsService.getOrgChallenges(ctx.user.id);
    }),

    reviewChallenge: orgProcedure
      .input(
        z.object({
          challengeId: z.number(),
          status: z.enum(['ORG_APPROVED', 'REJECTED']),
          rejectionReason: z.string().optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        return organizationsService.reviewOrgChallenge(ctx.user.id, input.challengeId, {
          status: input.status,
          rejectionReason: input.rejectionReason,
        });
      }),

    updateCurriculum: orgProcedure
      .input(
        z.object({
          allowedLanguages: z.array(z.string()),
          allowedCategories: z.array(z.string()),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        return organizationsService.updateCurriculumSettings(ctx.user.id, input as any);
      }),
  });
}
