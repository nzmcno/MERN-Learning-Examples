import { describe, it, expect } from 'vitest';
import { trackerRepository } from '@/server/repositories/tracker.repository';

describe('Exercise Tracker Repository & Stats', () => {
  it('should retrieve existing seed users', async () => {
    const users = await trackerRepository.getUsers();
    expect(users.length).toBeGreaterThanOrEqual(1);
    expect(users.some((u) => u.username === 'alex_runner')).toBe(true);
  });

  it('should create a new user profile', async () => {
    const newUser = await trackerRepository.createUser({
      username: 'test_athlete',
      email: 'test@athlete.com',
      targetDailyMinutes: 60,
    });

    expect(newUser.username).toBe('test_athlete');
    expect(newUser.targetDailyMinutes).toBe(60);
    expect(newUser.avatarUrl).toContain('dicebear.com');
  });

  it('should log an exercise workout session', async () => {
    const exercise = await trackerRepository.createExercise({
      username: 'alex_runner',
      description: 'Morning HIIT Sprint Session',
      duration: 35,
      date: new Date().toISOString(),
      category: 'Running',
    });

    expect(exercise.id).toBeDefined();
    expect(exercise.description).toBe('Morning HIIT Sprint Session');
    expect(exercise.duration).toBe(35);
    expect(exercise.category).toBe('Running');
  });

  it('should calculate accurate stats including calories and active minutes', async () => {
    const stats = await trackerRepository.calculateStats('alex_runner');
    expect(stats.totalMinutes).toBeGreaterThan(0);
    expect(stats.totalExercises).toBeGreaterThan(0);
    expect(stats.estimatedCalories).toBe(Math.round(stats.totalMinutes * 8.5));
    expect(stats.activeStreakDays).toBeGreaterThan(0);
    expect(stats.categoryBreakdown.Running).toBeGreaterThanOrEqual(0);
  });

  it('should filter exercises by category', async () => {
    const cyclingExercises = await trackerRepository.getExercises({ category: 'Cycling' });
    expect(cyclingExercises.every((e) => e.category === 'Cycling')).toBe(true);
  });
});
