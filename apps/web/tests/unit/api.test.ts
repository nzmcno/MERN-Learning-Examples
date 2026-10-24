import { describe, it, expect } from 'vitest';
import { app } from '@/server/api';

describe('Hono REST API Routes', () => {
  it('GET /api/health should return 200 with online services', async () => {
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('healthy');
    expect(body.services.tinder).toBe('online');
    expect(body.services.tiktok).toBe('online');
    expect(body.services.tracker).toBe('online');
  });

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

  it('GET /api/tiktok/videos returns video feed', async () => {
    const res = await app.request('/api/tiktok/videos');
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    expect(json.data[0].videoUrl).toBeDefined();
  });

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
});
