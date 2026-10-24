import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { trackerRepository } from '../repositories/tracker.repository';
import { ExerciseCategory, ExerciseLog } from '@/types';

export const trackerRoute = new Hono()
  // Users endpoints
  .get('/users', async (c) => {
    const users = await trackerRepository.getUsers();
    return c.json({ success: true, data: users });
  })

  .post(
    '/users',
    zValidator(
      'json',
      z.object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        email: z.string().email().optional(),
        targetDailyMinutes: z.coerce.number().min(10).max(300).optional().default(45),
      })
    ),
    async (c) => {
      const body = c.req.valid('json');
      const user = await trackerRepository.createUser(body);
      return c.json({ success: true, data: user }, 201);
    }
  )

  // Exercises endpoints
  .get('/exercises', async (c) => {
    const username = c.req.query('username');
    const category = c.req.query('category');
    const exercises = await trackerRepository.getExercises({ username, category });
    return c.json({ success: true, data: exercises });
  })

  .get('/exercises/:id', async (c) => {
    const id = c.req.param('id');
    const exercise = await trackerRepository.getExerciseById(id);
    if (!exercise) {
      return c.json({ success: false, error: 'Exercise not found' }, 404);
    }
    return c.json({ success: true, data: exercise });
  })

  .post(
    '/exercises',
    zValidator(
      'json',
      z.object({
        username: z.string().min(1, 'Username is required'),
        description: z.string().min(3, 'Description must be at least 3 characters'),
        duration: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
        date: z.string().min(1, 'Valid date is required'),
        category: z.enum(['Running', 'Gym', 'Cycling', 'Swimming', 'Yoga', 'Other'] as const).default('Gym'),
      })
    ),
    async (c) => {
      const body = c.req.valid('json');
      const exercise = await trackerRepository.createExercise({
        username: body.username,
        description: body.description,
        duration: body.duration,
        date: body.date,
        category: body.category as ExerciseCategory,
      });
      return c.json({ success: true, data: exercise }, 201);
    }
  )

  .put(
    '/exercises/:id',
    zValidator(
      'json',
      z.object({
        username: z.string().optional(),
        description: z.string().min(3).optional(),
        duration: z.coerce.number().min(1).optional(),
        date: z.string().optional(),
        category: z.enum(['Running', 'Gym', 'Cycling', 'Swimming', 'Yoga', 'Other'] as const).optional(),
      })
    ),
    async (c) => {
      const id = c.req.param('id');
      const body = c.req.valid('json');
      const updated = await trackerRepository.updateExercise(id, body as Partial<ExerciseLog>);
      if (!updated) {
        return c.json({ success: false, error: 'Exercise not found' }, 404);
      }
      return c.json({ success: true, data: updated });
    }
  )

  .delete('/exercises/:id', async (c) => {
    const id = c.req.param('id');
    const success = await trackerRepository.deleteExercise(id);
    if (!success) {
      return c.json({ success: false, error: 'Exercise not found or already deleted' }, 404);
    }
    return c.json({ success: true, message: 'Exercise deleted successfully' });
  })

  // Aggregate statistics
  .get('/stats', async (c) => {
    const username = c.req.query('username');
    const stats = await trackerRepository.calculateStats(username);
    return c.json({ success: true, data: stats });
  });
