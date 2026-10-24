import { ExerciseUser, ExerciseLog, TrackerStats, ExerciseCategory } from '@/types';
import { db, schema } from '@/db';

const initialUsers: ExerciseUser[] = [
  {
    id: 'user-1',
    username: 'alex_runner',
    email: 'alex@example.com',
    targetDailyMinutes: 50,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    username: 'sarah_fitness',
    email: 'sarah@example.com',
    targetDailyMinutes: 60,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-3',
    username: 'cem_developer',
    email: 'cem@example.com',
    targetDailyMinutes: 40,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  },
];

const initialExercises: ExerciseLog[] = [
  {
    id: 'ex-1',
    userId: 'user-1',
    username: 'alex_runner',
    description: 'Morning 5K Trail Run',
    category: 'Running',
    duration: 28,
    date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ex-2',
    userId: 'user-2',
    username: 'sarah_fitness',
    description: 'Heavy Deadlifts & Core Circuit',
    category: 'Gym',
    duration: 55,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ex-3',
    userId: 'user-3',
    username: 'cem_developer',
    description: 'Sunset Coastal Cycling',
    category: 'Cycling',
    duration: 45,
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ex-4',
    userId: 'user-1',
    username: 'alex_runner',
    description: 'Vinyasa Flow Yoga for Mobility',
    category: 'Yoga',
    duration: 35,
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const usersStore: ExerciseUser[] = [...initialUsers];
let exercisesStore: ExerciseLog[] = [...initialExercises];

export class TrackerRepository {
  async getUsers(): Promise<ExerciseUser[]> {
    if (db) {
      try {
        const rows = await db.select().from(schema.trackerUsers);
        if (rows.length > 0) {
          return rows.map((r) => ({
            ...r,
            email: r.email || undefined,
            createdAt: r.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        console.warn('Postgres query tracker_users failed, fallback to store', err);
      }
    }
    return usersStore;
  }

  async createUser(data: { username: string; email?: string; targetDailyMinutes?: number }): Promise<ExerciseUser> {
    const existing = usersStore.find((u) => u.username.toLowerCase() === data.username.toLowerCase());
    if (existing) {
      return existing;
    }

    const newUser: ExerciseUser = {
      id: `user-${Date.now()}`,
      username: data.username,
      email: data.email,
      targetDailyMinutes: data.targetDailyMinutes || 45,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.username)}`,
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await db.insert(schema.trackerUsers).values({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email || null,
          targetDailyMinutes: newUser.targetDailyMinutes,
          avatarUrl: newUser.avatarUrl,
        });
      } catch (err) {
        console.warn('Postgres insert failed, storing in memory', err);
      }
    }

    usersStore.push(newUser);
    return newUser;
  }

  async getExercises(filter?: { username?: string; category?: string }): Promise<ExerciseLog[]> {
    let result = [...exercisesStore];
    if (filter?.username && filter.username !== 'all') {
      result = result.filter((e) => e.username.toLowerCase() === filter.username!.toLowerCase());
    }
    if (filter?.category && filter.category !== 'all') {
      result = result.filter((e) => e.category.toLowerCase() === filter.category!.toLowerCase());
    }
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getExerciseById(id: string): Promise<ExerciseLog | null> {
    return exercisesStore.find((e) => e.id === id) || null;
  }

  async createExercise(data: {
    username: string;
    description: string;
    category?: ExerciseCategory;
    duration: number;
    date: string;
  }): Promise<ExerciseLog> {
    const user = usersStore.find((u) => u.username.toLowerCase() === data.username.toLowerCase());
    const userId = user?.id || 'guest';

    const newExercise: ExerciseLog = {
      id: `ex-${Date.now()}`,
      userId,
      username: data.username,
      description: data.description,
      category: data.category || 'Gym',
      duration: Number(data.duration),
      date: new Date(data.date).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    exercisesStore.unshift(newExercise);
    return newExercise;
  }

  async updateExercise(
    id: string,
    data: Partial<Pick<ExerciseLog, 'description' | 'duration' | 'date' | 'category' | 'username'>>
  ): Promise<ExerciseLog | null> {
    const index = exercisesStore.findIndex((e) => e.id === id);
    if (index === -1) return null;

    exercisesStore[index] = {
      ...exercisesStore[index],
      ...data,
      duration: data.duration !== undefined ? Number(data.duration) : exercisesStore[index].duration,
      date: data.date ? new Date(data.date).toISOString() : exercisesStore[index].date,
      updatedAt: new Date().toISOString(),
    };

    return exercisesStore[index];
  }

  async deleteExercise(id: string): Promise<boolean> {
    const prevLength = exercisesStore.length;
    exercisesStore = exercisesStore.filter((e) => e.id !== id);
    return exercisesStore.length < prevLength;
  }

  async calculateStats(username?: string): Promise<TrackerStats> {
    const exercises = await this.getExercises(username ? { username } : undefined);
    const totalMinutes = exercises.reduce((acc, curr) => acc + curr.duration, 0);
    const totalExercises = exercises.length;

    // Approximate calorie estimation: ~8.5 kcal per active minute
    const estimatedCalories = Math.round(totalMinutes * 8.5);

    const categoryBreakdown: Record<ExerciseCategory, number> = {
      Running: 0,
      Gym: 0,
      Cycling: 0,
      Swimming: 0,
      Yoga: 0,
      Other: 0,
    };

    for (const ex of exercises) {
      if (categoryBreakdown[ex.category] !== undefined) {
        categoryBreakdown[ex.category] += ex.duration;
      } else {
        categoryBreakdown.Other += ex.duration;
      }
    }

    return {
      totalMinutes,
      totalExercises,
      estimatedCalories,
      activeStreakDays: totalExercises > 0 ? Math.min(totalExercises + 1, 7) : 0,
      categoryBreakdown,
    };
  }
}

export const trackerRepository = new TrackerRepository();
