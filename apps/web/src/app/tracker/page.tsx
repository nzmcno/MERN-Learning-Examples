import { TrackerView } from '@/features/tracker/TrackerView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exercise Tracker 2026 | Modern Full-Stack',
  description: 'Evolution of the 2021 MERN exercise tracker into a modern analytics dashboard.',
};

export default function TrackerPage() {
  return <TrackerView />;
}
