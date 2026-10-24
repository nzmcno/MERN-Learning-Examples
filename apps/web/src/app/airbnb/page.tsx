import { AirbnbView } from '@/features/airbnb/AirbnbView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Airbnb Escapes 2026 | Modern Full-Stack',
  description: 'Architectural retreats, category filters, and instant stay reservations with Drizzle ORM.',
};

export default function AirbnbPage() {
  return <AirbnbView />;
}
