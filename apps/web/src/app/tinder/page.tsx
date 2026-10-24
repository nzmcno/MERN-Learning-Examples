import { TinderView } from '@/features/tinder/TinderView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tinder Clone 2026 | Modern Full-Stack',
  description: 'Interactive Tinder swipe cards, instant matches, and chat built with Next.js 16 and Hono.',
};

export default function TinderPage() {
  return <TinderView />;
}
