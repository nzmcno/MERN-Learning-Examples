import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { twitterRepository } from '../repositories/twitter.repository';

export const twitterRoute = new Hono()
  .get('/tweets', (c) => {
    const tweets = twitterRepository.getTweets();
    return c.json({ success: true, data: tweets });
  })

  .get('/trends', (c) => {
    const trends = twitterRepository.getTrends();
    return c.json({ success: true, data: trends });
  })

  .post(
    '/tweets',
    zValidator(
      'json',
      z.object({
        content: z.string().min(1).max(280),
        imageUrl: z.string().url().optional(),
        authorName: z.string().optional(),
        authorHandle: z.string().optional(),
      })
    ),
    (c) => {
      const body = c.req.valid('json');
      const tweet = twitterRepository.createTweet(body);
      return c.json({ success: true, data: tweet }, 201);
    }
  )

  .post('/tweets/:id/like', (c) => {
    const id = c.req.param('id');
    const updated = twitterRepository.toggleLike(id);
    if (!updated) {
      return c.json({ success: false, error: 'Tweet not found' }, 404);
    }
    return c.json({ success: true, data: updated });
  })

  .post('/tweets/:id/retweet', (c) => {
    const id = c.req.param('id');
    const updated = twitterRepository.toggleRetweet(id);
    if (!updated) {
      return c.json({ success: false, error: 'Tweet not found' }, 404);
    }
    return c.json({ success: true, data: updated });
  });
