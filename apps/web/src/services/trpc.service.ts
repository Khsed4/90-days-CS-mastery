import { trpc } from '../lib/trpc';

/**
 * tRPC Service wrapper showcasing end-to-end type safety.
 * All return types and parameters are inferred automatically from the NestJS backend routers!
 */
export const trpcService = {
  // Direct access to the type-safe tRPC proxy client
  client: trpc,

  // Challenges domain
  challenges: {
    getAllCore: () => trpc.challenges.allCore.query(),
    getBonus: () => trpc.challenges.bonus.query(),
    getById: (id: number) => trpc.challenges.byId.query({ id }),
    getMySubmissions: () => trpc.challenges.mySubmissions.query(),
    create: (data: Parameters<typeof trpc.challenges.create.mutate>[0]) =>
      trpc.challenges.create.mutate(data),
  },

  // Progress & Learner domain
  progress: {
    getMyProgress: () => trpc.progress.myProgress.query(),
    toggleDay: (dayId: number) => trpc.progress.toggleDay.mutate({ dayId }),
    sync: (completedDays: number[], interfaceLang?: string) =>
      trpc.progress.sync.mutate({ completedDays, interfaceLang }),
    getPreferences: () => trpc.progress.preferences.query(),
  },

  // Organization portal domain
  organizations: {
    getOverview: () => trpc.organizations.overview.query(),
    getMembers: (search?: string) => trpc.organizations.members.query({ search }),
    getInvites: () => trpc.organizations.invites.query(),
    getChallenges: () => trpc.organizations.challenges.query(),
  },

  // Admin platform domain
  admin: {
    getStats: () => trpc.admin.stats.query(),
    getUsers: (params?: Parameters<typeof trpc.admin.users.query>[0]) =>
      trpc.admin.users.query(params),
    getChallenges: (params?: Parameters<typeof trpc.admin.challenges.query>[0]) =>
      trpc.admin.challenges.query(params),
  },
};
