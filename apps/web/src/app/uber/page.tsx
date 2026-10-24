import { UberView } from '@/features/uber/UberView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uber Ride Dispatch 2026 | Modern Full-Stack',
  description: 'Interactive ride booking, dynamic fare matrix, and real-time driver dispatch simulation.',
};

export default function UberPage() {
  return <UberView />;
}
