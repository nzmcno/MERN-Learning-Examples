import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db, schema } from '@/db';

export const auth = betterAuth({
  database: db
    ? drizzleAdapter(db, {
        provider: 'pg',
        schema: {
          user: schema.users,
          session: schema.sessions,
          account: schema.accounts,
          verification: schema.verifications,
        },
      })
    : undefined,
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET || 'modern_stack_super_secret_jwt_key_2026_dev',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
});
