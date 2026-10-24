import { Tweet, TrendTopic } from '@/types';

const initialTweets: Tweet[] = [
  {
    id: 'tweet-1',
    authorName: 'Guillermo Rauch',
    authorHandle: 'rauchg',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    content: 'The speed of Next.js 16 + Turbopack compiling full-stack TypeScript routes in under 500ms feels like the future we were promised years ago. Unbelievable developer experience. 🚀⚡',
    likesCount: 2840,
    retweetsCount: 412,
    repliesCount: 128,
    isLiked: false,
    isRetweeted: false,
    createdAt: '2h',
  },
  {
    id: 'tweet-2',
    authorName: 'Yusuke Wada',
    authorHandle: 'yusukebe',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    content: 'Hono running directly inside Next.js App Router handlers via [[...route]] gives you standard web request standards, ultra-low overhead, and complete RPC type safety without managing separate servers. 🔥',
    likesCount: 1950,
    retweetsCount: 305,
    repliesCount: 64,
    isLiked: true,
    isRetweeted: false,
    createdAt: '4h',
  },
  {
    id: 'tweet-3',
    authorName: 'Drizzle Team',
    authorHandle: 'DrizzleORM',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    content: 'SQL doesn\'t need to be abstracted into oblivion. Write real SQL queries with complete TypeScript inference from column types to relations. Zero runtime bloat. 💧✨',
    likesCount: 3410,
    retweetsCount: 680,
    repliesCount: 142,
    isLiked: false,
    isRetweeted: false,
    createdAt: '7h',
  },
];

const mockTrends: TrendTopic[] = [
  { tag: '#NextJS16', category: 'Technology • Trending', tweetCount: '48.2K' },
  { tag: '#HonoEdge', category: 'Web Development • Trending', tweetCount: '21.5K' },
  { tag: '#TypeScript59', category: 'Programming • Trending', tweetCount: '64.1K' },
  { tag: '#DrizzleORM', category: 'Databases • Trending', tweetCount: '15.8K' },
  { tag: '#BetterAuth', category: 'Security • Trending', tweetCount: '9.4K' },
];

const tweetsStore: Tweet[] = [...initialTweets];

export class TwitterRepository {
  getTweets(): Tweet[] {
    return tweetsStore;
  }

  getTrends(): TrendTopic[] {
    return mockTrends;
  }

  createTweet(data: { content: string; imageUrl?: string; authorName?: string; authorHandle?: string }): Tweet {
    const newTweet: Tweet = {
      id: `tweet-${Date.now()}`,
      authorName: data.authorName || 'Modern Developer',
      authorHandle: data.authorHandle || 'dev_modern',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      content: data.content,
      imageUrl: data.imageUrl,
      likesCount: 0,
      retweetsCount: 0,
      repliesCount: 0,
      isLiked: false,
      isRetweeted: false,
      createdAt: 'Just now',
    };

    tweetsStore.unshift(newTweet);
    return newTweet;
  }

  toggleLike(id: string): Tweet | null {
    const tweet = tweetsStore.find((t) => t.id === id);
    if (!tweet) return null;

    tweet.isLiked = !tweet.isLiked;
    tweet.likesCount += tweet.isLiked ? 1 : -1;
    return tweet;
  }

  toggleRetweet(id: string): Tweet | null {
    const tweet = tweetsStore.find((t) => t.id === id);
    if (!tweet) return null;

    tweet.isRetweeted = !tweet.isRetweeted;
    tweet.retweetsCount += tweet.isRetweeted ? 1 : -1;
    return tweet;
  }
}

export const twitterRepository = new TwitterRepository();
