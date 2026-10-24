import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { tinderRoute } from './tinder';
import { tiktokRoute } from './tiktok';
import { trackerRoute } from './tracker';

export const app = new Hono()
  .basePath('/api')
  .use('*', logger())
  .use('*', cors())
  .get('/health', (c) => {
    return c.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      stack: 'Next.js 16 + Hono + Drizzle + TypeScript',
      services: {
        tinder: 'online',
        tiktok: 'online',
        tracker: 'online',
      },
    });
  })
  .route('/tinder', tinderRoute)
  .route('/tiktok', tiktokRoute)
  .route('/tracker', trackerRoute);

export type AppType = typeof app;
