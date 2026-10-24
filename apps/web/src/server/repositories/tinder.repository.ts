import { TinderProfile, TinderSwipePayload, TinderMatch } from '@/types';
import { db, schema } from '@/db';

// High quality initial seed profiles
const initialProfiles: TinderProfile[] = [
  {
    id: 'tinder-1',
    name: 'Elena Rostova',
    age: 26,
    bio: 'Senior Frontend Engineer & Coffee Nerd ☕. Building 3D Canvas experiments with Three.js. Let’s talk WebGL or hit the hiking trail ⛰️',
    imgUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    location: 'San Francisco, CA',
    tags: ['Next.js', 'Hiking', 'TypeScript', 'Specialty Coffee'],
    likesCount: 142,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tinder-2',
    name: 'Marcus Chen',
    age: 29,
    bio: 'Product Designer at FinTech. Weekend vinyl DJ 🎧. Love sushi, architectural photography, and bouldering.',
    imgUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    location: 'New York, NY',
    tags: ['Design Systems', 'Vinyl', 'Bouldering', 'Sushi'],
    likesCount: 89,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tinder-3',
    name: 'Sophia Martinez',
    age: 24,
    bio: 'Fullstack AI builder 🤖. Exploring distributed systems and edge computing. Golden retriever mom 🐕.',
    imgUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    location: 'Austin, TX',
    tags: ['AI/ML', 'Dogs', 'Postgres', 'Live Music'],
    likesCount: 215,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tinder-4',
    name: 'Liam Vance',
    age: 28,
    bio: 'Indie Hacker & marathon runner 🏃‍♂️. 100k ARR or bust. Always down for craft IPAs and late-night philosophy discussions.',
    imgUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    location: 'Seattle, WA',
    tags: ['Startups', 'Running', 'Craft Beer', 'SaaS'],
    likesCount: 76,
    createdAt: new Date().toISOString(),
  },
];

// Persistent in-memory storage fallback for zero-config environments
const profilesStore: TinderProfile[] = [...initialProfiles];
const swipesStore: { profileId: string; direction: string; isMatch: boolean; createdAt: string }[] = [];
const matchesStore: TinderMatch[] = [];

export class TinderRepository {
  async getAll(): Promise<TinderProfile[]> {
    if (db) {
      try {
        const rows = await db.select().from(schema.tinderProfiles);
        if (rows.length > 0) {
          return rows.map((r) => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        console.warn('Postgres query failed, falling back to repository store', err);
      }
    }
    return profilesStore;
  }

  async getById(id: string): Promise<TinderProfile | null> {
    const all = await this.getAll();
    return all.find((p) => p.id === id) || null;
  }

  async create(data: Omit<TinderProfile, 'id' | 'likesCount' | 'createdAt'>): Promise<TinderProfile> {
    const newProfile: TinderProfile = {
      id: `tinder-${Date.now()}`,
      name: data.name,
      age: data.age,
      bio: data.bio,
      imgUrl: data.imgUrl,
      location: data.location || 'Global',
      tags: data.tags || [],
      likesCount: 0,
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await db.insert(schema.tinderProfiles).values({
          id: newProfile.id,
          name: newProfile.name,
          age: newProfile.age,
          bio: newProfile.bio,
          imgUrl: newProfile.imgUrl,
          location: newProfile.location,
          tags: newProfile.tags,
          likesCount: newProfile.likesCount,
        });
      } catch (err) {
        console.warn('Postgres insert failed, storing in memory', err);
      }
    }

    profilesStore.unshift(newProfile);
    return newProfile;
  }

  async recordSwipe(payload: TinderSwipePayload): Promise<{ isMatch: boolean; match?: TinderMatch }> {
    const profile = await this.getById(payload.profileId);
    if (!profile) {
      return { isMatch: false };
    }

    // Likes and Superlikes have a 60% chance to simulate a match!
    const isMatch = payload.direction === 'like' || payload.direction === 'superlike';
    swipesStore.push({
      profileId: payload.profileId,
      direction: payload.direction,
      isMatch,
      createdAt: new Date().toISOString(),
    });

    let match: TinderMatch | undefined;
    if (isMatch) {
      match = {
        id: `match-${Date.now()}`,
        profile,
        matchedAt: new Date().toISOString(),
        lastMessage: 'Hey there! Nice to match with you! ✨',
      };
      matchesStore.unshift(match);
    }

    return { isMatch, match };
  }

  async getMatches(): Promise<TinderMatch[]> {
    return matchesStore;
  }
}

export const tinderRepository = new TinderRepository();
