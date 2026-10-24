'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Plus,
  Disc,
  Play,
  Upload,
  Send,
  Sparkles,
} from 'lucide-react';
import { TikTokVideo, TikTokComment } from '@/types';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { apiFetch } from '@/lib/api-client';
import { useAppStore } from '@/stores/useAppStore';

export function TikTokView() {
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { isMuted, toggleMute } = useAppStore();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<TikTokComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [followedAuthors, setFollowedAuthors] = useState<Record<string, boolean>>({});
  const [uploadForm, setUploadForm] = useState({
    authorName: 'modern_creator',
    caption: '',
    songTitle: 'Original Audio - 2026 Beats',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  });

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    async function loadVideos() {
      try {
        const data = await apiFetch<TikTokVideo[]>('/api/tiktok/videos');
        setVideos(data);
      } catch (err) {
        console.error('Failed to load TikTok videos', err);
      }
    }
    loadVideos();
  }, []);

  const activeVideo = videos[activeVideoIndex];

  // Load comments when comments drawer opens
  useEffect(() => {
    if (isCommentsOpen && activeVideo) {
      apiFetch<TikTokComment[]>(`/api/tiktok/videos/${activeVideo.id}/comments`)
        .then(setComments)
        .catch(console.error);
    }
  }, [isCommentsOpen, activeVideo]);

  const togglePlayPause = (idx: number) => {
    const video = videoRefs.current[idx];
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await apiFetch<TikTokVideo>(`/api/tiktok/videos/${id}/like`, {
        method: 'POST',
      });
      setVideos((prev) => prev.map((v) => (v.id === id ? updated : v)));
    } catch (err) {
      console.error('Like toggle error', err);
    }
  };

  const handleFollowToggle = (author: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowedAuthors((prev) => ({
      ...prev,
      [author]: !prev[author],
    }));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Video link copied to clipboard! 📋');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeVideo) return;

    try {
      const created = await apiFetch<TikTokComment>(`/api/tiktok/videos/${activeVideo.id}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          authorName: 'Alex Runner',
          text: newCommentText,
        }),
      });

      setComments((prev) => [created, ...prev]);
      setVideos((prev) =>
        prev.map((v) =>
          v.id === activeVideo.id ? { ...v, commentsCount: v.commentsCount + 1 } : v
        )
      );
      setNewCommentText('');
    } catch (err) {
      console.error('Error posting comment', err);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await apiFetch<TikTokVideo>('/api/tiktok/videos', {
        method: 'POST',
        body: JSON.stringify(uploadForm),
      });

      setVideos((prev) => [created, ...prev]);
      setActiveVideoIndex(0);
      setIsUploadOpen(false);
      setUploadForm({
        authorName: 'modern_creator',
        caption: '',
        songTitle: 'Original Audio - 2026 Beats',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      });
    } catch (err) {
      console.error('Upload video error', err);
      alert('Error uploading video');
    }
  };

  return (
    <div className="relative mx-auto flex h-[calc(100vh-4rem)] max-w-md flex-col bg-black text-white overflow-hidden sm:rounded-3xl sm:border sm:border-zinc-800 sm:my-3 sm:shadow-2xl">
      {/* Top Bar Overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <button
          onClick={toggleMute}
          className="rounded-full bg-black/40 backdrop-blur-md p-2 text-white hover:bg-black/60 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="h-5 w-5 text-zinc-300" /> : <Volume2 className="h-5 w-5 text-emerald-400" />}
        </button>

        <div className="flex gap-4 text-sm font-bold">
          <span className="text-zinc-400 cursor-pointer hover:text-white">Following</span>
          <span className="text-white border-b-2 border-white pb-0.5 cursor-pointer">For You</span>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="rounded-full bg-cyan-500/80 hover:bg-cyan-500 p-2 text-white shadow-md transition-colors cursor-pointer"
          title="Upload TikTok Video"
        >
          <Upload className="h-4 w-4" />
        </button>
      </div>

      {/* Vertical Video Scroll Container */}
      <div
        className="relative flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar"
        onScroll={(e) => {
          const container = e.currentTarget;
          const idx = Math.round(container.scrollTop / container.clientHeight);
          if (idx !== activeVideoIndex && videos[idx]) {
            setActiveVideoIndex(idx);
          }
        }}
      >
        {videos.map((vid, idx) => (
          <div
            key={vid.id}
            className="relative h-full w-full snap-start flex items-center justify-center bg-zinc-950"
            onClick={() => togglePlayPause(idx)}
          >
            {/* Video Element */}
            <video
              ref={(el) => {
                videoRefs.current[idx] = el;
              }}
              src={vid.videoUrl}
              loop
              muted={isMuted}
              autoPlay={idx === activeVideoIndex}
              playsInline
              className="h-full w-full object-cover"
            />

            {/* Play/Pause overlay indicator */}
            {!isPlaying && idx === activeVideoIndex && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                  <Play className="h-8 w-8 fill-white text-white ml-1" />
                </div>
              </div>
            )}

            {/* Right Action Sidebar */}
            <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-5">
              {/* Creator Avatar & Follow Button */}
              <div className="relative">
                <img
                  src={vid.authorAvatar}
                  alt={vid.authorName}
                  className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-lg"
                />
                {!followedAuthors[vid.authorName] && (
                  <button
                    onClick={(e) => handleFollowToggle(vid.authorName, e)}
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Plus className="h-3 w-3 stroke-[3]" />
                  </button>
                )}
              </div>

              {/* Like Button */}
              <button
                onClick={(e) => handleToggleLike(vid.id, e)}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-md group-hover:bg-black/60 transition-all ${
                    vid.isLiked ? 'text-rose-500' : 'text-white'
                  }`}
                >
                  <Heart
                    className={`h-6 w-6 transition-transform group-hover:scale-125 ${
                      vid.isLiked ? 'fill-rose-500' : ''
                    }`}
                  />
                </div>
                <span className="text-[11px] font-bold">{vid.likes.toLocaleString()}</span>
              </button>

              {/* Comment Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCommentsOpen(true);
                }}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-md group-hover:bg-black/60 transition-all">
                  <MessageCircle className="h-6 w-6 text-white group-hover:scale-110" />
                </div>
                <span className="text-[11px] font-bold">{vid.commentsCount.toLocaleString()}</span>
              </button>

              {/* Bookmark */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert('Added to Saved Collections!');
                }}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-md group-hover:bg-black/60 transition-all">
                  <Bookmark className="h-6 w-6 text-white group-hover:scale-110" />
                </div>
                <span className="text-[11px] font-bold">{vid.shares.toLocaleString()}</span>
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-md group-hover:bg-black/60 transition-all">
                  <Share2 className="h-6 w-6 text-white group-hover:scale-110" />
                </div>
                <span className="text-[11px] font-bold">Share</span>
              </button>

              {/* Spinning Vinyl Disc */}
              <div className="relative mt-2 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700 animate-spin duration-3000">
                <Disc className="h-6 w-6 text-zinc-300" />
              </div>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-4 left-4 right-16 z-20 space-y-2 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm pointer-events-auto cursor-pointer hover:underline">
                  @{vid.authorName}
                </span>
                {followedAuthors[vid.authorName] && (
                  <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full font-semibold">
                    Following
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-100 line-clamp-2 leading-relaxed">
                {vid.caption}
              </p>

              {/* Sound Ticker */}
              <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium overflow-hidden">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <div className="truncate">{vid.songTitle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comments Drawer Modal */}
      <Modal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        title="Comments"
        description={`${comments.length} comments on this video`}
        className="max-w-md bg-zinc-950 text-white border-zinc-800"
      >
        <div className="flex flex-col h-80">
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {comments.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No comments yet. Be the first to reply!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex gap-2.5 items-start">
                  <img
                    src={c.authorAvatar}
                    alt={c.authorName}
                    className="h-8 w-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-300">{c.authorName}</span>
                      <span className="text-[10px] text-zinc-500">{c.createdAt}</span>
                    </div>
                    <p className="mt-1 text-zinc-200 leading-normal">{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2 pt-3 border-t border-zinc-800">
            <Input
              placeholder="Add a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-white text-xs"
            />
            <Button type="submit" size="sm" className="bg-cyan-500 hover:bg-cyan-600">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Modal>

      {/* Upload Video Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload TikTok Video"
        description="Add a new vertical video to the modern Hono feed"
        className="max-w-md bg-zinc-950 text-white border-zinc-800"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300">Creator Handle</label>
            <Input
              required
              placeholder="e.g. tech_master"
              value={uploadForm.authorName}
              onChange={(e) => setUploadForm({ ...uploadForm, authorName: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300">Caption & Hashtags</label>
            <Input
              required
              placeholder="Check out this awesome 2026 tech stack! #nextjs #hono"
              value={uploadForm.caption}
              onChange={(e) => setUploadForm({ ...uploadForm, caption: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300">Music / Sound Track</label>
            <Input
              required
              placeholder="Original Audio - Artist Name"
              value={uploadForm.songTitle}
              onChange={(e) => setUploadForm({ ...uploadForm, songTitle: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300">Video MP4 URL</label>
            <Input
              required
              placeholder="https://.../video.mp4"
              value={uploadForm.videoUrl}
              onChange={(e) => setUploadForm({ ...uploadForm, videoUrl: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
              Publish Video
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
