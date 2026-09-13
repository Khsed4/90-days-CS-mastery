import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';

export interface TrpcUser {
  id: string;
  email: string;
  role: string;
  organizationId?: string | null;
}

export function createTrpcContextFactory(jwtService: JwtService, prisma: PrismaService) {
  return async ({ req, res }: CreateExpressContextOptions) => {
    let user: TrpcUser | null = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payload = jwtService.verify(token);
        if (payload && payload.sub) {
          const dbUser = await prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, email: true, role: true, organizationId: true },
          });
          if (dbUser) {
            user = {
              id: dbUser.id,
              email: dbUser.email,
              role: dbUser.role,
              organizationId: dbUser.organizationId,
            };
          }
        }
      } catch {
        // Token invalid or expired: proceed as guest/unauthenticated user
      }
    }

    return {
      req,
      res,
      user,
    };
  };
}

export type TrpcContext = inferAsyncReturnType<ReturnType<typeof createTrpcContextFactory>>;
