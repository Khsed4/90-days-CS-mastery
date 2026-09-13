import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@api/trpc';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    return apiUrl.replace(/\/api\/?$/, '');
  }
  return process.env.INTERNAL_API_URL || 'http://localhost:4000';
};

/**
 * Type-safe tRPC client proxy.
 * Communicates directly with the NestJS API at `/api/trpc`
 * and automatically attaches the current JWT Bearer token from localStorage.
 */
export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: {
    serialize: (object: any) => object,
    deserialize: (object: any) => object,
  },
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers() {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            return {
              Authorization: `Bearer ${token}`,
            };
          }
        }
        return {};
      },
    }),
  ],
});
