import { TikTokView } from '@/features/tiktok/TikTokView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TikTok Clone 2026 | Modern Full-Stack',
  description: 'Vertical snap-scrolling video feed with dynamic comments and like interactions.',
};

export default function TikTokPage() {
  return <TikTokView />;
}
