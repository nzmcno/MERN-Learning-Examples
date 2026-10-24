import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email().optional(),
  targetDailyMinutes: z.coerce.number().min(10).max(300).default(45),
});

const exerciseSchema = z.object({
  username: z.string().min(1),
  description: z.string().min(3),
  duration: z.coerce.number().min(1),
  date: z.string().min(1),
  category: z.enum(['Running', 'Gym', 'Cycling', 'Swimming', 'Yoga', 'Other']).default('Gym'),
});

const tinderSwipeSchema = z.object({
  profileId: z.string().min(1),
  direction: z.enum(['like', 'pass', 'superlike']),
});

describe('Zod Schema Validations', () => {
  it('validates correct user creation payload', () => {
    const valid = userSchema.safeParse({
      username: 'johndoe',
      email: 'john@example.com',
      targetDailyMinutes: 50,
    });
    expect(valid.success).toBe(true);
  });

  it('rejects short usernames (< 3 characters)', () => {
    const invalid = userSchema.safeParse({ username: 'ab' });
    expect(invalid.success).toBe(false);
  });

  it('validates workout log payload', () => {
    const valid = exerciseSchema.safeParse({
      username: 'alex',
      description: 'Squats and lunges',
      duration: '45',
      date: '2026-10-24',
      category: 'Gym',
    });
    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.duration).toBe(45);
    }
  });

  it('validates Tinder swipe directions', () => {
    expect(tinderSwipeSchema.safeParse({ profileId: 'p1', direction: 'like' }).success).toBe(true);
    expect(tinderSwipeSchema.safeParse({ profileId: 'p1', direction: 'superlike' }).success).toBe(true);
    expect(tinderSwipeSchema.safeParse({ profileId: 'p1', direction: 'invalid' }).success).toBe(false);
  });
});
