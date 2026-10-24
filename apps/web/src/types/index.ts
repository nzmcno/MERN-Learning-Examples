export interface TinderProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  imgUrl: string;
  location: string;
  tags: string[];
  likesCount: number;
  createdAt: string;
}

export interface TinderSwipePayload {
  profileId: string;
  direction: 'like' | 'pass' | 'superlike';
}

export interface TinderMatch {
  id: string;
  profile: TinderProfile;
  matchedAt: string;
  lastMessage?: string;
}

export interface TikTokComment {
  id: string;
  videoId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface TikTokVideo {
  id: string;
  authorName: string;
  authorAvatar: string;
  caption: string;
  songTitle: string;
  videoUrl: string;
  likes: number;
  commentsCount: number;
  shares: number;
  isLiked?: boolean;
  createdAt: string;
}

export type ExerciseCategory = 'Running' | 'Gym' | 'Cycling' | 'Swimming' | 'Yoga' | 'Other';

export interface ExerciseUser {
  id: string;
  username: string;
  email?: string;
  targetDailyMinutes: number;
  avatarUrl: string;
  createdAt: string;
}

export interface ExerciseLog {
  id: string;
  userId: string;
  username: string;
  description: string;
  category: ExerciseCategory;
  duration: number; // in minutes
  date: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface TrackerStats {
  totalMinutes: number;
  totalExercises: number;
  estimatedCalories: number;
  activeStreakDays: number;
  categoryBreakdown: Record<ExerciseCategory, number>;
}
