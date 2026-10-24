import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { uberRepository } from '../repositories/uber.repository';
import { UberTier } from '@/types';

export const uberRoute = new Hono()
  .get(
    '/estimates',
    zValidator(
      'query',
      z.object({
        pickup: z.string().default('Market St & 4th St, SF'),
        destination: z.string().default('SFO Airport Terminal 2'),
      })
    ),
    (c) => {
      const { pickup, destination } = c.req.valid('query');
      const estimates = uberRepository.getEstimates(pickup, destination);
      return c.json({ success: true, data: estimates });
    }
  )

  .get('/rides', (c) => {
    const rides = uberRepository.getRides();
    return c.json({ success: true, data: rides });
  })

  .post(
    '/request',
    zValidator(
      'json',
      z.object({
        pickup: z.string().min(2),
        destination: z.string().min(2),
        tier: z.enum(['UberX', 'Comfort', 'UberBlack', 'UberGreen']),
        fare: z.coerce.number().min(1),
      })
    ),
    (c) => {
      const body = c.req.valid('json');
      const ride = uberRepository.requestRide({
        ...body,
        tier: body.tier as UberTier,
      });
      return c.json({ success: true, data: ride }, 201);
    }
  )

  .post('/rides/:id/cancel', (c) => {
    const id = c.req.param('id');
    const cancelled = uberRepository.cancelRide(id);
    if (!cancelled) {
      return c.json({ success: false, error: 'Ride not found' }, 404);
    }
    return c.json({ success: true, data: cancelled });
  });
