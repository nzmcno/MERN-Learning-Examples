import { TwitterView } from '@/features/twitter/TwitterView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'X / Twitter 2026 | Modern Full-Stack',
  description: 'Real-time social timeline, interactive tweet composer, trending topics, and like/retweet actions.',
};

export default function TwitterPage() {
  return <TwitterView />;
}
