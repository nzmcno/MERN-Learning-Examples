'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame,
  RotateCcw,
  X,
  Star,
  Heart,
  Zap,
  MessageCircle,
  MapPin,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { TinderProfile, TinderMatch } from '@/types';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { apiFetch } from '@/lib/api-client';

export function TinderView() {
  const [profiles, setProfiles] = useState<TinderProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<TinderMatch[]>([]);
  const [activeMatch, setActiveMatch] = useState<TinderMatch | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'me' | 'them'; text: string }[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State for New Profile
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    bio: '',
    imgUrl: '',
    location: 'San Francisco, CA',
    tags: 'TypeScript, Next.js, Coffee',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiFetch<TinderProfile[]>('/api/tinder/cards');
        setProfiles(data);
        const matchData = await apiFetch<TinderMatch[]>('/api/tinder/matches');
        setMatches(matchData);
      } catch (err) {
        console.error('Failed to load Tinder cards', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const currentProfile = profiles[currentIndex];

  const handleSwipe = async (direction: 'like' | 'pass' | 'superlike') => {
    if (!currentProfile) return;

    try {
      const res = await apiFetch<{ isMatch: boolean; match?: TinderMatch }>('/api/tinder/swipe', {
        method: 'POST',
        body: JSON.stringify({
          profileId: currentProfile.id,
          direction,
        }),
      });

      if (res.isMatch && res.match) {
        setActiveMatch(res.match);
        setMatches((prev) => [res.match!, ...prev]);
        setChatMessages([
          { sender: 'them', text: `Hey there! Great to match with you! ✨ Loved your profile.` },
        ]);
      }
    } catch (err) {
      console.error('Swipe error', err);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleRewind = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCard = await apiFetch<TinderProfile>('/api/tinder/cards', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          age: Number(formData.age),
          bio: formData.bio,
          imgUrl: formData.imgUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
          location: formData.location,
          tags: formData.tags.split(',').map((t) => t.trim()),
        }),
      });

      setProfiles((prev) => [newCard, ...prev]);
      setCurrentIndex(0);
      setIsAddProfileOpen(false);
      setFormData({
        name: '',
        age: 25,
        bio: '',
        imgUrl: '',
        location: 'San Francisco, CA',
        tags: 'TypeScript, Next.js, Coffee',
      });
    } catch (err) {
      console.error('Failed to create profile', err);
      alert('Error creating profile. Check input parameters.');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setChatMessages((prev) => [...prev, { sender: 'me', text: messageInput }]);
    setMessageInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'them', text: `That's awesome! How's your modern TypeScript stack going? 🚀` },
      ]);
    }, 1200);
  };

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-between px-4 py-4 sm:py-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsAddProfileOpen(true)}
          title="Create New Profile"
          className="rounded-full text-zinc-600 dark:text-zinc-400"
        >
          <PlusCircle className="h-6 w-6" />
        </Button>

        <div className="flex items-center gap-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-sm">
            <Flame className="h-5 w-5 fill-white" />
          </div>
          <span className="font-black text-xl tracking-tight bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
            tinder
          </span>
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="rounded-full text-zinc-600 dark:text-zinc-400"
          >
            <MessageCircle className="h-6 w-6" />
            {matches.length > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {matches.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Main Card Area */}
      <div className="relative flex flex-1 items-center justify-center py-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 text-zinc-500">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
            <p className="text-sm font-medium">Finding nearby profiles...</p>
          </div>
        ) : currentProfile ? (
          <div className="group relative h-[560px] w-full overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl transition-all">
            {/* Background Image with Fallback */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${currentProfile.imgUrl})` }}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20" />

            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black">{currentProfile.name}</h2>
                <span className="text-2xl font-light text-zinc-300">{currentProfile.age}</span>
                <CheckCircle2 className="h-5 w-5 text-sky-400 fill-sky-400/20" />
              </div>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-300">
                <MapPin className="h-3.5 w-3.5 text-rose-400" />
                <span>{currentProfile.location}</span>
              </div>

              <p className="mt-3 text-sm text-zinc-200 line-clamp-3 leading-relaxed">
                {currentProfile.bio}
              </p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {currentProfile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold">No More Profiles</h3>
            <p className="mt-1 text-sm text-zinc-500">
              You’ve reviewed all profiles in your radar. Rewind to start over or add your own custom card!
            </p>
            <div className="mt-5 flex gap-3">
              <Button onClick={() => setCurrentIndex(0)} variant="outline">
                Reset Stack
              </Button>
              <Button onClick={() => setIsAddProfileOpen(true)} variant="default">
                Add Profile
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Swipe Action Buttons (Original 5 Buttons Re-Engineered) */}
      <div className="flex items-center justify-center gap-3 pt-3 pb-2">
        {/* Rewind */}
        <button
          onClick={handleRewind}
          disabled={currentIndex === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-amber-500 shadow-lg border border-zinc-200 dark:border-zinc-700 hover:scale-110 active:scale-95 disabled:opacity-30 transition-all cursor-pointer"
          title="Rewind"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        {/* Pass (Dislike) */}
        <button
          onClick={() => handleSwipe('pass')}
          disabled={!currentProfile}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-rose-500 shadow-xl border border-zinc-200 dark:border-zinc-700 hover:scale-110 active:scale-95 disabled:opacity-30 transition-all cursor-pointer"
          title="Dislike"
        >
          <X className="h-7 w-7 stroke-[2.5]" />
        </button>

        {/* Superlike */}
        <button
          onClick={() => handleSwipe('superlike')}
          disabled={!currentProfile}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-sky-400 shadow-lg border border-zinc-200 dark:border-zinc-700 hover:scale-110 active:scale-95 disabled:opacity-30 transition-all cursor-pointer"
          title="Superlike"
        >
          <Star className="h-5 w-5 fill-sky-400/20" />
        </button>

        {/* Like */}
        <button
          onClick={() => handleSwipe('like')}
          disabled={!currentProfile}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-emerald-500 shadow-xl border border-zinc-200 dark:border-zinc-700 hover:scale-110 active:scale-95 disabled:opacity-30 transition-all cursor-pointer"
          title="Like"
        >
          <Heart className="h-7 w-7 fill-emerald-500/20 stroke-[2.5]" />
        </button>

        {/* Boost */}
        <button
          onClick={() => alert('⚡ Profile Boost activated! You are top profile in your area for 30 minutes.')}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-purple-500 shadow-lg border border-zinc-200 dark:border-zinc-700 hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title="Boost"
        >
          <Zap className="h-5 w-5 fill-purple-500/20" />
        </button>
      </div>

      {/* Match Popup Modal */}
      {activeMatch && (
        <Modal
          isOpen={!!activeMatch}
          onClose={() => setActiveMatch(null)}
          className="max-w-sm text-center bg-zinc-950 text-white border-zinc-800"
        >
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-xl animate-bounce">
              <Heart className="h-8 w-8 fill-white" />
            </div>

            <h3 className="mt-4 font-black text-2xl tracking-tight bg-gradient-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent">
              It&apos;s a Match!
            </h3>
            <p className="mt-1 text-xs text-zinc-400">
              You and {activeMatch.profile.name} liked each other!
            </p>

            <div className="mt-5 flex items-center justify-center -space-x-4">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                alt="You"
                className="h-20 w-20 rounded-full border-4 border-zinc-950 object-cover"
              />
              <img
                src={activeMatch.profile.imgUrl}
                alt={activeMatch.profile.name}
                className="h-20 w-20 rounded-full border-4 border-zinc-950 object-cover"
              />
            </div>

            <div className="mt-6 flex w-full flex-col gap-2">
              <Button
                variant="gradient"
                onClick={() => {
                  setActiveMatch(null);
                  setIsChatOpen(true);
                }}
              >
                Send Message
              </Button>
              <Button variant="ghost" onClick={() => setActiveMatch(null)}>
                Keep Swiping
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Matches & Chat Drawer Modal */}
      <Modal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        title="Matches & Messages"
        description="Connect and chat with your recent matches"
      >
        <div className="flex flex-col h-96">
          {/* Matches Row */}
          <div className="flex gap-3 overflow-x-auto pb-4 border-b border-zinc-200 dark:border-zinc-800">
            {matches.length === 0 ? (
              <p className="text-xs text-zinc-500 py-2">No matches yet. Keep swiping right!</p>
            ) : (
              matches.map((m) => (
                <div key={m.id} className="flex flex-col items-center gap-1 cursor-pointer">
                  <div className="relative">
                    <img
                      src={m.profile.imgUrl}
                      alt={m.profile.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-rose-500 p-0.5"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <span className="text-[11px] font-medium truncate w-14 text-center">
                    {m.profile.name.split(' ')[0]}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs ${
                    msg.sender === 'me'
                      ? 'bg-rose-500 text-white rounded-br-none'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <Input
              placeholder="Say something friendly..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="text-xs"
            />
            <Button type="submit" size="sm" variant="default" className="bg-rose-500 hover:bg-rose-600">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Modal>

      {/* Add Profile Modal */}
      <Modal
        isOpen={isAddProfileOpen}
        onClose={() => setIsAddProfileOpen(false)}
        title="Create New Tinder Card"
        description="Add a new profile card into the modern Hono + Drizzle database"
      >
        <form onSubmit={handleAddProfile} className="space-y-4">
          <div>
            <label className="text-xs font-semibold">Name</label>
            <Input
              required
              placeholder="e.g. Alex Walker"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold">Age</label>
              <Input
                type="number"
                min="18"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Location</label>
              <Input
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold">Image URL</label>
            <Input
              required
              placeholder="https://images.unsplash.com/..."
              value={formData.imgUrl}
              onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Bio</label>
            <Input
              required
              placeholder="Short bio about hobbies, tech, music..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Tags (comma separated)</label>
            <Input
              placeholder="TypeScript, Next.js, Coffee, Bouldering"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddProfileOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default" className="bg-rose-500 hover:bg-rose-600">
              Create Card
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
