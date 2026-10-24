import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { tinderRoute } from './tinder';
import { tiktokRoute } from './tiktok';
import { trackerRoute } from './tracker';
import { uberRoute } from './uber';
import { airbnbRoute } from './airbnb';
import { twitterRoute } from './twitter';

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
        uber: 'online',
        airbnb: 'online',
        twitter: 'online',
      },
    });
  })
  .route('/tinder', tinderRoute)
  .route('/tiktok', tiktokRoute)
  .route('/tracker', trackerRoute)
  .route('/uber', uberRoute)
  .route('/airbnb', airbnbRoute)
  .route('/twitter', twitterRoute);

export type AppType = typeof app;
