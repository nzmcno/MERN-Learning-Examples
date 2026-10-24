import { TikTokVideo, TikTokComment } from '@/types';
import { db, schema } from '@/db';

const initialVideos: TikTokVideo[] = [
  {
    id: 'tiktok-1',
    authorName: 'tech_dev_daily',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    caption: 'Why Hono + Next.js App Router in 2026 feels like magic ✨ High performance TypeScript REST endpoints in seconds! #coding #typescript #webdev #hono',
    songTitle: 'original sound - Synthwave Beats 🎧',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    likes: 1240,
    commentsCount: 88,
    shares: 45,
    isLiked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tiktok-2',
    authorName: 'cyber_creator',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    caption: 'Neon city aesthetic running late night coding sessions 🌃 Who else gets most productive at 2 AM? 💻⚡ #nightvibes #cyberpunk #coderlife',
    songTitle: 'Nightcall - Cyber Vibe Mix',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    likes: 3820,
    commentsCount: 164,
    shares: 112,
    isLiked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tiktok-3',
    authorName: 'fitness_coder',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    caption: 'Desk posture check! 3 stretches you need to do right now if you sit for 8+ hours a day. Your spine will thank you! 🧘‍♂️ #fitness #healthydev #posture',
    songTitle: 'Lo-Fi Chill Workout Tape',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    likes: 954,
    commentsCount: 42,
    shares: 31,
    isLiked: false,
    createdAt: new Date().toISOString(),
  },
];

const videosStore: TikTokVideo[] = [...initialVideos];
const commentsStore: Record<string, TikTokComment[]> = {
  'tiktok-1': [
    {
      id: 'c-1',
      videoId: 'tiktok-1',
      authorName: 'dan_react',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      text: 'Hono type-safe RPC inside Next.js routes is completely replacing legacy express servers for me.',
      createdAt: '10m ago',
    },
    {
      id: 'c-2',
      videoId: 'tiktok-1',
      authorName: 'sarah_codes',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      text: 'Clean monorepo structure makes this so easy to maintain!',
      createdAt: '5m ago',
    },
  ],
};

export class TikTokRepository {
  async getAll(): Promise<TikTokVideo[]> {
    if (db) {
      try {
        const rows = await db.select().from(schema.tiktokVideos);
        if (rows.length > 0) {
          return rows.map((r) => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        console.warn('Postgres query failed, fallback to store', err);
      }
    }
    return videosStore;
  }

  async getById(id: string): Promise<TikTokVideo | null> {
    const videos = await this.getAll();
    return videos.find((v) => v.id === id) || null;
  }

  async toggleLike(id: string): Promise<TikTokVideo | null> {
    const video = await this.getById(id);
    if (!video) return null;

    video.isLiked = !video.isLiked;
    video.likes += video.isLiked ? 1 : -1;
    return video;
  }

  async getComments(videoId: string): Promise<TikTokComment[]> {
    return commentsStore[videoId] || [];
  }

  async addComment(videoId: string, authorName: string, text: string): Promise<TikTokComment> {
    const newComment: TikTokComment = {
      id: `comment-${Date.now()}`,
      videoId,
      authorName: authorName || 'Anonymous Dev',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      text,
      createdAt: 'Just now',
    };

    if (!commentsStore[videoId]) {
      commentsStore[videoId] = [];
    }
    commentsStore[videoId].unshift(newComment);

    const video = await this.getById(videoId);
    if (video) {
      video.commentsCount += 1;
    }

    return newComment;
  }

  async createVideo(data: {
    authorName: string;
    caption: string;
    songTitle: string;
    videoUrl: string;
  }): Promise<TikTokVideo> {
    const newVideo: TikTokVideo = {
      id: `tiktok-${Date.now()}`,
      authorName: data.authorName || 'modern_creator',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      caption: data.caption,
      songTitle: data.songTitle || 'Original Audio',
      videoUrl: data.videoUrl,
      likes: 1,
      commentsCount: 0,
      shares: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };

    videosStore.unshift(newVideo);
    return newVideo;
  }
}

export const tiktokRepository = new TikTokRepository();
