'use client';

import React, { useState, useEffect } from 'react';
import {
  Heart,
  Repeat2,
  MessageCircle,
  Share,
  Image as ImageIcon,
  CheckCircle2,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import { Tweet, TrendTopic } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { apiFetch } from '@/lib/api-client';

const mockFollowSuggestions = [
  {
    name: 'Lee Robinson',
    handle: 'leeerob',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    bio: 'VP of Product @ Vercel. Next.js, React, Web Dev.',
  },
  {
    name: 'Tanner Linsley',
    handle: 'tannerlinsley',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    bio: 'Creator of TanStack Query, Table, Virtual.',
  },
];

export function TwitterView() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [trends, setTrends] = useState<TrendTopic[]>([]);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [followedUsers, setFollowedUsers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadTwitterData() {
      try {
        const tweetsData = await apiFetch<Tweet[]>('/api/twitter/tweets');
        setTweets(tweetsData);
        const trendsData = await apiFetch<TrendTopic[]>('/api/twitter/trends');
        setTrends(trendsData);
      } catch (err) {
        console.error('Failed to load Twitter data', err);
      }
    }
    loadTwitterData();
  }, []);

  const handlePostTweet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsPosting(true);

    try {
      const created = await apiFetch<Tweet>('/api/twitter/tweets', {
        method: 'POST',
        body: JSON.stringify({
          content,
          imageUrl: imageUrl || undefined,
        }),
      });

      setTweets((prev) => [created, ...prev]);
      setContent('');
      setImageUrl('');
    } catch (err) {
      console.error('Error posting tweet', err);
      alert('Error creating tweet');
    } finally {
      setIsPosting(false);
    }
  };

  const handleToggleLike = async (id: string) => {
    try {
      const updated = await apiFetch<Tweet>(`/api/twitter/tweets/${id}/like`, { method: 'POST' });
      setTweets((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Like tweet error', err);
    }
  };

  const handleToggleRetweet = async (id: string) => {
    try {
      const updated = await apiFetch<Tweet>(`/api/twitter/tweets/${id}/retweet`, { method: 'POST' });
      setTweets((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Retweet error', err);
    }
  };

  const toggleFollow = (handle: string) => {
    setFollowedUsers((prev) => ({
      ...prev,
      [handle]: !prev[handle],
    }));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Center Main Feed */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header Title */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="font-mono text-2xl font-black">𝕏</span>
              <span>Home Feed</span>
            </h1>
            <Badge variant="outline" className="text-[10px]">
              Next.js 16 Realtime Stream
            </Badge>
          </div>

          {/* Tweet Composer */}
          <Card className="border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
            <form onSubmit={handlePostTweet}>
              <div className="flex gap-3">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                  alt="You"
                  className="h-10 w-10 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 space-y-3">
                  <textarea
                    rows={3}
                    placeholder="What is happening?!"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full resize-none bg-transparent text-sm focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-900 dark:text-zinc-100"
                  />

                  {imageUrl && (
                    <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 max-h-48">
                      <img src={imageUrl} alt="Attachment" className="w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-2 right-2 rounded-full bg-black/60 text-white p-1 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt('Enter Image URL to attach:');
                          if (url) setImageUrl(url);
                        }}
                        className="rounded-full p-2 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/50 transition-colors cursor-pointer"
                        title="Add Image"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </button>
                      <span className="text-[11px] text-zinc-400">
                        {280 - content.length} chars left
                      </span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isPosting || !content.trim()}
                      className="rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs h-8 px-4"
                    >
                      {isPosting ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Card>

          {/* Tweets Feed */}
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            {tweets.map((tweet) => (
              <div key={tweet.id} className="p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <div className="flex gap-3">
                  <img
                    src={tweet.authorAvatar}
                    alt={tweet.authorName}
                    className="h-10 w-10 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    {/* Author header */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {tweet.authorName}
                      </span>
                      {tweet.isVerified && (
                        <CheckCircle2 className="h-3.5 w-3.5 fill-sky-400 text-sky-400" />
                      )}
                      <span className="text-zinc-400 font-normal">@{tweet.authorHandle}</span>
                      <span className="text-zinc-400">·</span>
                      <span className="text-zinc-400">{tweet.createdAt}</span>
                    </div>

                    {/* Content text */}
                    <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                      {tweet.content}
                    </p>

                    {/* Media Image if present */}
                    {tweet.imageUrl && (
                      <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 mt-2 max-h-72">
                        <img src={tweet.imageUrl} alt="Tweet media" className="w-full object-cover" />
                      </div>
                    )}

                    {/* Tweet Action Bar */}
                    <div className="flex items-center justify-between max-w-md pt-2 text-zinc-500 text-xs">
                      {/* Replies */}
                      <button
                        onClick={() => alert('Reply dialog opened')}
                        className="flex items-center gap-1.5 hover:text-sky-500 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{tweet.repliesCount}</span>
                      </button>

                      {/* Retweet */}
                      <button
                        onClick={() => handleToggleRetweet(tweet.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          tweet.isRetweeted ? 'text-emerald-500 font-bold' : 'hover:text-emerald-500'
                        }`}
                      >
                        <Repeat2 className="h-4 w-4" />
                        <span>{tweet.retweetsCount}</span>
                      </button>

                      {/* Like */}
                      <button
                        onClick={() => handleToggleLike(tweet.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          tweet.isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${tweet.isLiked ? 'fill-rose-500' : ''}`} />
                        <span>{tweet.likesCount}</span>
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => {
                          if (typeof navigator !== 'undefined' && navigator.clipboard) {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Tweet link copied to clipboard!');
                          }
                        }}
                        className="flex items-center gap-1.5 hover:text-sky-500 transition-colors cursor-pointer"
                      >
                        <Share className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Trends & Follow suggestions */}
        <div className="space-y-5 lg:col-span-4">
          {/* Trends Card */}
          <Card className="border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
            <h3 className="font-black text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-sky-500" />
              <span>What&apos;s happening</span>
            </h3>

            <div className="space-y-3">
              {trends.map((item) => (
                <div
                  key={item.tag}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 p-1.5 -mx-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="text-[10px] text-zinc-400 block">{item.category}</span>
                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 block">
                    {item.tag}
                  </span>
                  <span className="text-[10px] text-zinc-500">{item.tweetCount} Posts</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Who to Follow Card */}
          <Card className="border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
            <h3 className="font-black text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-3">
              <UserPlus className="h-4 w-4 text-emerald-500" />
              <span>Who to follow</span>
            </h3>

            <div className="space-y-3">
              {mockFollowSuggestions.map((user) => {
                const isFollowed = followedUsers[user.handle];
                return (
                  <div key={user.handle} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                          {user.name}
                        </span>
                        <span className="text-zinc-400 text-[11px]">@{user.handle}</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => toggleFollow(user.handle)}
                      variant={isFollowed ? 'outline' : 'default'}
                      className={`h-7 px-3 text-[11px] rounded-full font-bold ${
                        isFollowed ? '' : 'bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black'
                      }`}
                    >
                      {isFollowed ? 'Following' : 'Follow'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
