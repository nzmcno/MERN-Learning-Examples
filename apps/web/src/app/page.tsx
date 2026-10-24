'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  PlaySquare,
  Dumbbell,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  Database,
  Cpu,
  Car,
  Home as HomeIcon,
  MessageSquare,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api-client';

interface HealthResponse {
  status: string;
  timestamp?: string;
  services?: {
    tinder: string;
    tiktok: string;
    tracker: string;
    uber?: string;
    airbnb?: string;
    twitter?: string;
  };
}

export default function Home() {
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);

  useEffect(() => {
    apiFetch<HealthResponse>('/api/health')
      .then(setHealthStatus)
      .catch(() => setHealthStatus({ status: 'offline' }));
  }, []);

  const apps = [
    {
      title: 'Tinder Clone',
      description: 'Swipe cards deck, instant match celebration modal, live chat drawer, and custom profile creation.',
      href: '/tinder',
      icon: Flame,
      gradient: 'from-rose-500 to-amber-500',
      badge: 'Swipe Engine',
      stats: 'Cards Deck • Match Modal • Live Chat',
    },
    {
      title: 'TikTok Clone',
      description: 'Vertical snap-scroll feed, looping video player, dynamic heart bursts, comments drawer, and video uploader.',
      href: '/tiktok',
      icon: PlaySquare,
      gradient: 'from-cyan-500 to-blue-600',
      badge: 'Vertical Feed',
      stats: 'Snap Scroll • Audio Ticker • Comments Sheet',
    },
    {
      title: 'Uber Ride Dispatch',
      description: 'Real-time ride booking, dynamic fare matrix across tiers (UberX, Comfort, Black, Green), interactive route map, and driver telemetry.',
      href: '/uber',
      icon: Car,
      gradient: 'from-emerald-500 to-teal-700',
      badge: 'Dispatch System',
      stats: 'Fare Calculator • Live Map • Driver Status',
    },
    {
      title: 'Airbnb Escapes',
      description: 'Category pills carousel (Beachfront, Cabins, Pools), property search, multi-photo cards, star ratings, and instant stay reservation.',
      href: '/airbnb',
      icon: HomeIcon,
      gradient: 'from-pink-500 to-rose-600',
      badge: 'Vacation Rentals',
      stats: 'Category Carousel • Price Calculator • Booking',
    },
    {
      title: '𝕏 / Twitter Timeline',
      description: '3-column realtime timeline, tweet composer with media upload, trending hashtags (#NextJS16, #HonoEdge), and like/retweet counters.',
      href: '/twitter',
      icon: MessageSquare,
      gradient: 'from-sky-400 to-indigo-600',
      badge: 'Realtime Feed',
      stats: 'Tweet Composer • Trends • Like & Retweet',
    },
    {
      title: 'Exercise Tracker 2026',
      description: 'Complete evolution of the 2021 MERN tracker into a high-performance analytics dashboard with KPI streaks, calorie estimation, and full CRUD.',
      href: '/tracker',
      icon: Dumbbell,
      gradient: 'from-amber-500 to-orange-600',
      badge: 'Evolved 2021 MERN',
      stats: 'Calorie Counter • Streaks • Full CRUD',
    },
  ];

  const stackTechnologies = [
    { name: 'Next.js 16 (App Router)', role: 'Frontend, SSR & Routing', icon: Layers },
    { name: 'TypeScript 5.9 (Strict)', role: 'End-to-End Type Safety', icon: Cpu },
    { name: 'Hono API', role: 'Ultra-fast REST API & RPC', icon: Zap },
    { name: 'PostgreSQL + Drizzle', role: 'Type-Safe SQL & Migrations', icon: Database },
    { name: 'Better Auth', role: 'Modern Authentication & Sessions', icon: ShieldCheck },
    { name: 'Tailwind CSS + shadcn', role: 'Design System & UI Components', icon: Sparkles },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 sm:p-12 text-white border border-zinc-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
              Modern Full-Stack Web App Stack 2026
            </span>
            {healthStatus?.status === 'healthy' && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Hono Microservices Online
              </span>
            )}
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl leading-tight">
            Next.js + TypeScript + Hono + PostgreSQL + Drizzle + Better Auth
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Famous web application clones (<strong>Tinder, TikTok, Uber, Airbnb, 𝕏 / Twitter, and Exercise Tracker</strong>) built on a single unified TypeScript architecture inside a high-performance pnpm monorepo.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <Link href="/tinder">
              <Button size="sm" className="gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold">
                <Flame className="h-4 w-4" />
                <span>Tinder</span>
              </Button>
            </Link>
            <Link href="/tiktok">
              <Button size="sm" className="gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold">
                <PlaySquare className="h-4 w-4" />
                <span>TikTok</span>
              </Button>
            </Link>
            <Link href="/uber">
              <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                <Car className="h-4 w-4" />
                <span>Uber</span>
              </Button>
            </Link>
            <Link href="/airbnb">
              <Button size="sm" className="gap-1.5 bg-pink-600 hover:bg-pink-700 text-white font-bold">
                <HomeIcon className="h-4 w-4" />
                <span>Airbnb</span>
              </Button>
            </Link>
            <Link href="/twitter">
              <Button size="sm" className="gap-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold">
                <MessageSquare className="h-4 w-4" />
                <span>𝕏 / Twitter</span>
              </Button>
            </Link>
            <Link href="/tracker">
              <Button size="sm" className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold">
                <Dumbbell className="h-4 w-4" />
                <span>Tracker</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Cloned Web Applications Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Famous Web Application Clones (6 Apps)
            </h2>
            <p className="text-xs text-zinc-500">
              Fully interactive web platforms powered by Hono REST endpoints and Drizzle ORM
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <Card
                key={app.title}
                className="group relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${app.gradient} text-white shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {app.badge}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4 text-xl font-bold">{app.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {app.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-2.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                    {app.stats}
                  </div>

                  <Link href={app.href} className="block">
                    <Button className="w-full gap-2 font-bold group-hover:gap-3 transition-all">
                      <span>Open Application</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 2026 Tech Stack Breakdown */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
        <div className="max-w-2xl mb-8">
          <Badge className="mb-2">Architecture</Badge>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            Why this replaces the legacy 2021 MERN Stack
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500">
            Traditional MERN (MongoDB + Express + React 17 + Node) suffered from runtime schema drift, fragmented build systems, un-typed endpoints, and lack of SSR. The 2026 stack delivers instant compilation, compile-time type safety from SQL to UI, and sub-millisecond edge APIs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stackTechnologies.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.name}
                className="flex items-start gap-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 p-4 transition-colors hover:bg-zinc-100/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {tech.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{tech.role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
