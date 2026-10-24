'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flame,
  PlaySquare,
  Dumbbell,
  LayoutGrid,
  Car,
  Home,
  MessageSquare,
  GitBranch,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Hub', href: '/', icon: LayoutGrid, color: 'text-zinc-600 dark:text-zinc-400' },
    { label: 'Tinder', href: '/tinder', icon: Flame, color: 'text-rose-500' },
    { label: 'TikTok', href: '/tiktok', icon: PlaySquare, color: 'text-cyan-400' },
    { label: 'Uber', href: '/uber', icon: Car, color: 'text-emerald-500' },
    { label: 'Airbnb', href: '/airbnb', icon: Home, color: 'text-pink-500' },
    { label: '𝕏 / Twitter', href: '/twitter', icon: MessageSquare, color: 'text-sky-500' },
    { label: 'Tracker', href: '/tracker', icon: Dumbbell, color: 'text-amber-500' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-rose-500 to-amber-400 text-white shadow-sm font-black text-lg">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold leading-none">ModernStack</span>
            <span className="text-[10px] text-zinc-500 font-medium">Next 16 • Hono • Drizzle</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 p-1 border border-zinc-200/50 dark:border-zinc-800/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', item.color)} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Repo info */}
        <div className="flex items-center gap-3">
          <Link
            href="/(dashboard)/dashboard"
            className="hidden sm:inline-flex text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 px-2 py-1 rounded-lg"
          >
            Diagnostics
          </Link>
          <a
            href="https://github.com/nzmcno/MERN-Learning-Examples"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <GitBranch className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
