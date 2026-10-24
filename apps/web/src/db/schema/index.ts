import { pgTable, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

// -------------------------------------------------------------
// Better Auth Core Tables
// -------------------------------------------------------------
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// -------------------------------------------------------------
// Tinder App Tables
// -------------------------------------------------------------
export const tinderProfiles = pgTable('tinder_profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  bio: text('bio').notNull(),
  imgUrl: text('img_url').notNull(),
  location: text('location').notNull(),
  tags: jsonb('tags').$type<string[]>().default([]).notNull(),
  likesCount: integer('likes_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tinderSwipes = pgTable('tinder_swipes', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => tinderProfiles.id, { onDelete: 'cascade' }),
  direction: text('direction').notNull(), // 'like' | 'pass' | 'superlike'
  isMatch: boolean('is_match').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// TikTok App Tables
// -------------------------------------------------------------
export const tiktokVideos = pgTable('tiktok_videos', {
  id: text('id').primaryKey(),
  authorName: text('author_name').notNull(),
  authorAvatar: text('author_avatar').notNull(),
  caption: text('caption').notNull(),
  songTitle: text('song_title').notNull(),
  videoUrl: text('video_url').notNull(),
  likes: integer('likes').default(0).notNull(),
  commentsCount: integer('comments_count').default(0).notNull(),
  shares: integer('shares').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tiktokComments = pgTable('tiktok_comments', {
  id: text('id').primaryKey(),
  videoId: text('video_id')
    .notNull()
    .references(() => tiktokVideos.id, { onDelete: 'cascade' }),
  authorName: text('author_name').notNull(),
  authorAvatar: text('author_avatar').notNull(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// Exercise Tracker App Tables (Modernized from Legacy MERN)
// -------------------------------------------------------------
export const trackerUsers = pgTable('tracker_users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email'),
  targetDailyMinutes: integer('target_daily_minutes').default(45).notNull(),
  avatarUrl: text('avatar_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const trackerExercises = pgTable('tracker_exercises', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  username: text('username').notNull(),
  description: text('description').notNull(),
  category: text('category').default('Gym').notNull(),
  duration: integer('duration').notNull(), // in minutes
  date: timestamp('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
