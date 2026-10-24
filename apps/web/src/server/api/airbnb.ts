import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { airbnbRepository } from '../repositories/airbnb.repository';
import { AirbnbCategory } from '@/types';

export const airbnbRoute = new Hono()
  .get('/listings', (c) => {
    const category = c.req.query('category');
    const search = c.req.query('search');
    const listings = airbnbRepository.getAll(category, search);
    return c.json({ success: true, data: listings });
  })

  .get('/listings/:id', (c) => {
    const id = c.req.param('id');
    const listing = airbnbRepository.getById(id);
    if (!listing) {
      return c.json({ success: false, error: 'Listing not found' }, 404);
    }
    return c.json({ success: true, data: listing });
  })

  .post(
    '/listings',
    zValidator(
      'json',
      z.object({
        title: z.string().min(5),
        description: z.string().min(10),
        category: z.enum([
          'Beachfront',
          'Cabins',
          'Iconic Cities',
          'Mansions',
          'Amazing Pools',
          'Countryside',
          'Lakefront',
        ]),
        location: z.string().min(3),
        pricePerNight: z.coerce.number().min(20),
        imageUrls: z.array(z.string().url()).min(1),
        hostName: z.string().default('Can Host'),
        hostAvatar: z.string().default('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'),
        isSuperhost: z.boolean().default(true),
        maxGuests: z.coerce.number().min(1).default(4),
        bedrooms: z.coerce.number().min(1).default(2),
        bathrooms: z.coerce.number().min(1).default(1),
      })
    ),
    (c) => {
      const body = c.req.valid('json');
      const created = airbnbRepository.createListing({
        ...body,
        category: body.category as AirbnbCategory,
      });
      return c.json({ success: true, data: created }, 201);
    }
  )

  .post('/listings/:id/favorite', (c) => {
    const id = c.req.param('id');
    const updated = airbnbRepository.toggleFavorite(id);
    if (!updated) {
      return c.json({ success: false, error: 'Listing not found' }, 404);
    }
    return c.json({ success: true, data: updated });
  })

  .post(
    '/reservations',
    zValidator(
      'json',
      z.object({
        listingId: z.string().min(1),
        checkIn: z.string().min(1),
        checkOut: z.string().min(1),
        guests: z.coerce.number().min(1),
        totalNights: z.coerce.number().min(1),
      })
    ),
    (c) => {
      const body = c.req.valid('json');
      const reservation = airbnbRepository.createReservation(body);
      return c.json({ success: true, data: reservation }, 201);
    }
  )

  .get('/reservations', (c) => {
    const reservations = airbnbRepository.getReservations();
    return c.json({ success: true, data: reservations });
  });
