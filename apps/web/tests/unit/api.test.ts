import { describe, it, expect } from 'vitest';
import { app } from '@/server/api';

describe('Hono REST API Routes', () => {
  it('GET /api/health should return 200 with all online services', async () => {
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('healthy');
    expect(body.services.tinder).toBe('online');
    expect(body.services.tiktok).toBe('online');
    expect(body.services.tracker).toBe('online');
    expect(body.services.uber).toBe('online');
    expect(body.services.airbnb).toBe('online');
    expect(body.services.twitter).toBe('online');
  });

  // Tinder Tests
  it('GET /api/tinder/cards returns profile cards list', async () => {
    const res = await app.request('/api/tinder/cards');
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
  });

  it('POST /api/tinder/swipe processes swipe direction', async () => {
    const res = await app.request('/api/tinder/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileId: 'tinder-1',
        direction: 'like',
      }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.isMatch).toBeDefined();
  });

  // TikTok Tests
  it('GET /api/tiktok/videos returns video feed', async () => {
    const res = await app.request('/api/tiktok/videos');
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    expect(json.data[0].videoUrl).toBeDefined();
  });

  // Tracker Tests
  it('POST /api/tracker/exercises adds a new exercise', async () => {
    const res = await app.request('/api/tracker/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'alex_runner',
        description: 'Vitest Automated Run',
        category: 'Running',
        duration: 25,
        date: new Date().toISOString(),
      }),
    });

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.description).toBe('Vitest Automated Run');
  });

  // Uber Tests
  it('GET /api/uber/estimates returns ride tiers with estimated prices', async () => {
    const res = await app.request('/api/uber/estimates?pickup=Downtown&destination=Airport');
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThanOrEqual(4);
    expect(json.data[0].estimatedPrice).toBeGreaterThan(0);
  });

  it('POST /api/uber/request dispatches a driver', async () => {
    const res = await app.request('/api/uber/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pickup: 'Market St',
        destination: 'SFO Airport',
        tier: 'UberX',
        fare: 35,
      }),
    });

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.driverName).toBeDefined();
    expect(json.data.status).toBe('driver_assigned');
  });

  // Airbnb Tests
  it('GET /api/airbnb/listings returns vacation listings', async () => {
    const res = await app.request('/api/airbnb/listings');
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    expect(json.data[0].pricePerNight).toBeGreaterThan(0);
  });

  it('POST /api/airbnb/reservations confirms stay reservation', async () => {
    const res = await app.request('/api/airbnb/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listingId: 'ab-1',
        checkIn: '2026-12-01',
        checkOut: '2026-12-05',
        guests: 2,
        totalNights: 4,
      }),
    });

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.totalPrice).toBeGreaterThan(0);
  });

  // Twitter / X Tests
  it('GET /api/twitter/tweets returns tweets stream', async () => {
    const res = await app.request('/api/twitter/tweets');
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
  });

  it('POST /api/twitter/tweets publishes a new tweet', async () => {
    const res = await app.request('/api/twitter/tweets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Vitest Automated Tweet testing 2026 stack! 🚀',
        authorName: 'Test Bot',
        authorHandle: 'testbot',
      }),
    });

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.content).toBe('Vitest Automated Tweet testing 2026 stack! 🚀');
  });
});
