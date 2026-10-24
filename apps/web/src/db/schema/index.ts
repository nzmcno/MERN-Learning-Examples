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
  direction: text('direction').notNull(),
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
// Exercise Tracker App Tables
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
  duration: integer('duration').notNull(),
  date: timestamp('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// Uber App Tables
// -------------------------------------------------------------
export const uberRides = pgTable('uber_rides', {
  id: text('id').primaryKey(),
  pickup: text('pickup').notNull(),
  destination: text('destination').notNull(),
  tier: text('tier').notNull(), // 'UberX' | 'Comfort' | 'UberBlack' | 'UberGreen'
  fare: integer('fare').notNull(), // in whole dollars
  status: text('status').notNull(), // 'searching' | 'driver_assigned' | 'in_transit' | 'completed' | 'cancelled'
  driverName: text('driver_name'),
  driverCar: text('driver_car'),
  driverLicense: text('driver_license'),
  driverRating: integer('driver_rating'), // scaled (e.g. 490 = 4.90)
  driverAvatar: text('driver_avatar'),
  etaMins: integer('eta_mins'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// Airbnb App Tables
// -------------------------------------------------------------
export const airbnbListings = pgTable('airbnb_listings', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  location: text('location').notNull(),
  pricePerNight: integer('price_per_night').notNull(),
  rating: integer('rating').notNull(), // scaled 492 = 4.92
  reviewsCount: integer('reviews_count').notNull(),
  imageUrls: jsonb('image_urls').$type<string[]>().default([]).notNull(),
  hostName: text('host_name').notNull(),
  hostAvatar: text('host_avatar').notNull(),
  isSuperhost: boolean('is_superhost').default(true).notNull(),
  maxGuests: integer('max_guests').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const airbnbReservations = pgTable('airbnb_reservations', {
  id: text('id').primaryKey(),
  listingId: text('listing_id')
    .notNull()
    .references(() => airbnbListings.id, { onDelete: 'cascade' }),
  listingTitle: text('listing_title').notNull(),
  checkIn: text('check_in').notNull(),
  checkOut: text('check_out').notNull(),
  guests: integer('guests').notNull(),
  totalNights: integer('total_nights').notNull(),
  totalPrice: integer('total_price').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------------------------------------------------
// Twitter / X App Tables
// -------------------------------------------------------------
export const twitterTweets = pgTable('twitter_tweets', {
  id: text('id').primaryKey(),
  authorName: text('author_name').notNull(),
  authorHandle: text('author_handle').notNull(),
  authorAvatar: text('author_avatar').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  likesCount: integer('likes_count').default(0).notNull(),
  retweetsCount: integer('retweets_count').default(0).notNull(),
  repliesCount: integer('replies_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
