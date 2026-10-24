// -------------------------------------------------------------
// Tinder App Types
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// TikTok App Types
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// Exercise Tracker App Types
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// Uber App Types
// -------------------------------------------------------------
export type UberTier = 'UberX' | 'Comfort' | 'UberBlack' | 'UberGreen';

export interface UberRideOption {
  tier: UberTier;
  title: string;
  description: string;
  capacity: number;
  multiplier: number;
  etaMins: number;
  estimatedPrice: number;
}

export interface UberRide {
  id: string;
  pickup: string;
  destination: string;
  tier: UberTier;
  fare: number;
  status: 'searching' | 'driver_assigned' | 'in_transit' | 'completed' | 'cancelled';
  driverName?: string;
  driverCar?: string;
  driverLicense?: string;
  driverRating?: number;
  driverAvatar?: string;
  etaMins?: number;
  createdAt: string;
}

// -------------------------------------------------------------
// Airbnb App Types
// -------------------------------------------------------------
export type AirbnbCategory =
  | 'Beachfront'
  | 'Cabins'
  | 'Iconic Cities'
  | 'Mansions'
  | 'Amazing Pools'
  | 'Countryside'
  | 'Lakefront';

export interface AirbnbListing {
  id: string;
  title: string;
  description: string;
  category: AirbnbCategory;
  location: string;
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  imageUrls: string[];
  hostName: string;
  hostAvatar: string;
  isSuperhost: boolean;
  isFavorite?: boolean;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  createdAt: string;
}

export interface AirbnbReservation {
  id: string;
  listingId: string;
  listingTitle: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalNights: number;
  totalPrice: number;
  createdAt: string;
}

// -------------------------------------------------------------
// Twitter / X App Types
// -------------------------------------------------------------
export interface Tweet {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isVerified: boolean;
  content: string;
  imageUrl?: string;
  likesCount: number;
  retweetsCount: number;
  repliesCount: number;
  isLiked?: boolean;
  isRetweeted?: boolean;
  createdAt: string;
}

export interface TrendTopic {
  tag: string;
  category: string;
  tweetCount: string;
}
