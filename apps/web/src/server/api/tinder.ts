import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { tinderRepository } from '../repositories/tinder.repository';

export const tinderRoute = new Hono()
  // GET all profiles
  .get('/cards', async (c) => {
    const cards = await tinderRepository.getAll();
    return c.json({ success: true, data: cards });
  })

  // GET single profile
  .get('/cards/:id', async (c) => {
    const id = c.req.param('id');
    const profile = await tinderRepository.getById(id);
    if (!profile) {
      return c.json({ success: false, error: 'Profile not found' }, 404);
    }
    return c.json({ success: true, data: profile });
  })

  // POST create profile
  .post(
    '/cards',
    zValidator(
      'json',
      z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        age: z.coerce.number().min(18, 'Must be at least 18'),
        bio: z.string().min(5, 'Bio must be at least 5 characters'),
        imgUrl: z.string().url('Must provide valid image URL'),
        location: z.string().optional().default('San Francisco, CA'),
        tags: z.array(z.string()).optional().default([]),
      })
    ),
    async (c) => {
      const body = c.req.valid('json');
      const newProfile = await tinderRepository.create(body);
      return c.json({ success: true, data: newProfile }, 201);
    }
  )

  // POST swipe action (like / pass / superlike)
  .post(
    '/swipe',
    zValidator(
      'json',
      z.object({
        profileId: z.string(),
        direction: z.enum(['like', 'pass', 'superlike']),
      })
    ),
    async (c) => {
      const body = c.req.valid('json');
      const result = await tinderRepository.recordSwipe(body);
      return c.json({ success: true, data: result });
    }
  )

  // GET matches
  .get('/matches', async (c) => {
    const matches = await tinderRepository.getMatches();
    return c.json({ success: true, data: matches });
  });
