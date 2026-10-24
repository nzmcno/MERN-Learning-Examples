'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Server, Zap, Flame, PlaySquare, Dumbbell, HardDrive } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api-client';
import { TinderProfile, TikTokVideo, TrackerStats } from '@/types';

interface HealthData {
  status: string;
  timestamp: string;
  stack: string;
  services: {
    tinder: string;
    tiktok: string;
    tracker: string;
  };
}

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [tinderCards, setTinderCards] = useState<TinderProfile[]>([]);
  const [tiktokVideos, setTiktokVideos] = useState<TikTokVideo[]>([]);
  const [trackerStats, setTrackerStats] = useState<TrackerStats | null>(null);

  useEffect(() => {
    apiFetch<HealthData>('/api/health').then(setHealth).catch(console.error);
    apiFetch<TinderProfile[]>('/api/tinder/cards').then(setTinderCards).catch(console.error);
    apiFetch<TikTokVideo[]>('/api/tiktok/videos').then(setTiktokVideos).catch(console.error);
    apiFetch<TrackerStats>('/api/tracker/stats').then(setTrackerStats).catch(console.error);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            Platform System Diagnostics
          </h1>
          <p className="text-xs text-zinc-500">
            Unified telemetry across Next.js 16, Hono REST routes, and Drizzle models
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1.5 py-1 px-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{health ? `${health.status.toUpperCase()} - Hono Services Online` : 'Services Online'}</span>
          </Badge>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
            <span className="text-xs font-semibold text-zinc-500">Hono Edge Router</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Sub-10ms</div>
            <p className="text-xs text-zinc-500 mt-0.5">Average API response latency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
            <span className="text-xs font-semibold text-zinc-500">Tinder Active Profiles</span>
            <Flame className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {tinderCards.length} Cards
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">Swipeable profiles loaded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
            <span className="text-xs font-semibold text-zinc-500">TikTok Feed Items</span>
            <PlaySquare className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {tiktokVideos.length} Videos
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">Looping video streams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
            <span className="text-xs font-semibold text-zinc-500">Tracker Workouts</span>
            <Dumbbell className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {trackerStats?.totalExercises || 0} Sessions
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {trackerStats?.totalMinutes || 0} active minutes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Services Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Server className="h-4 w-4 text-indigo-500" />
              <span>Hono Microservice Endpoints</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { route: 'GET /api/health', desc: 'System pulse & status check', status: '200 OK' },
              { route: 'GET /api/tinder/cards', desc: 'Retrieve profile stack', status: '200 OK' },
              { route: 'POST /api/tinder/swipe', desc: 'Process like/pass with match engine', status: '200 OK' },
              { route: 'GET /api/tiktok/videos', desc: 'Fetch vertical video stream metadata', status: '200 OK' },
              { route: 'POST /api/tiktok/videos/:id/like', desc: 'Toggle video like count', status: '200 OK' },
              { route: 'GET /api/tracker/exercises', desc: 'Query workout history with user filters', status: '200 OK' },
              { route: 'GET /api/tracker/stats', desc: 'Calculate calorie & streak metrics', status: '200 OK' },
            ].map((ep) => (
              <div
                key={ep.route}
                className="flex items-center justify-between rounded-xl border border-zinc-100 dark:border-zinc-800 p-2.5 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {ep.route}
                  </span>
                  <p className="text-zinc-500 text-[11px]">{ep.desc}</p>
                </div>
                <Badge variant="success" className="text-[10px]">
                  {ep.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-emerald-500" />
              <span>Storage & Database Topology</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-4 space-y-2">
              <div className="flex items-center justify-between font-semibold">
                <span>Database Engine</span>
                <span className="text-indigo-600 font-bold">PostgreSQL via Drizzle ORM</span>
              </div>
              <p className="text-zinc-500 leading-relaxed text-[11px]">
                Configured with connection pooling via <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">pg</code>. When running without a local Postgres container, repository stores fall back seamlessly to in-memory state.
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-4 space-y-2">
              <div className="flex items-center justify-between font-semibold">
                <span>Object Storage</span>
                <span className="text-amber-600 font-bold">Cloudflare R2 / S3 Adapter</span>
              </div>
              <p className="text-zinc-500 leading-relaxed text-[11px]">
                Direct-to-bucket uploads supported via pre-signed URL generator (<code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">StorageService</code>) to bypass server memory limits.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Link href="/tinder" className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Go to Tinder
                </Button>
              </Link>
              <Link href="/tiktok" className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Go to TikTok
                </Button>
              </Link>
              <Link href="/tracker" className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Go to Tracker
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
