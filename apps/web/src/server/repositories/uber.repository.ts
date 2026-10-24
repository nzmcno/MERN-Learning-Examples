import { UberRide, UberRideOption, UberTier } from '@/types';

const defaultTiers: Omit<UberRideOption, 'estimatedPrice'>[] = [
  {
    tier: 'UberX',
    title: 'UberX',
    description: 'Affordable, compact rides for everyday trips',
    capacity: 4,
    multiplier: 1.0,
    etaMins: 3,
  },
  {
    tier: 'Comfort',
    title: 'Comfort',
    description: 'Newer cars with extra legroom & top-rated drivers',
    capacity: 4,
    multiplier: 1.35,
    etaMins: 5,
  },
  {
    tier: 'UberBlack',
    title: 'Uber Black',
    description: 'Premium luxury black cars with professional chauffeurs',
    capacity: 4,
    multiplier: 2.1,
    etaMins: 7,
  },
  {
    tier: 'UberGreen',
    title: 'Uber Green',
    description: '100% electric zero-emission vehicles (Tesla, Ioniq)',
    capacity: 4,
    multiplier: 1.15,
    etaMins: 4,
  },
];

const mockDrivers = [
  {
    name: 'Michael Vance',
    car: 'Tesla Model 3 • Pearl White',
    license: '7XYZ890',
    rating: 4.97,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Sarah Jenkins',
    car: 'BMW 5 Series • Sapphire Black',
    license: '6ABC123',
    rating: 4.99,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'David Kim',
    car: 'Hyundai Ioniq 5 • Cyber Gray',
    license: '8ELC456',
    rating: 4.95,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
];

const ridesStore: UberRide[] = [
  {
    id: 'ride-prev-1',
    pickup: 'SFO International Airport',
    destination: 'Downtown Financial District, SF',
    tier: 'UberX',
    fare: 38,
    status: 'completed',
    driverName: 'Michael Vance',
    driverCar: 'Tesla Model 3 • Pearl White',
    driverLicense: '7XYZ890',
    driverRating: 4.97,
    driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    etaMins: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export class UberRepository {
  getEstimates(pickup: string, destination: string): UberRideOption[] {
    // Generate deterministic base fare based on string lengths
    const distanceFactor = Math.max(8, (pickup.length + destination.length) % 35);
    const baseFare = 12 + distanceFactor * 0.9;

    return defaultTiers.map((t) => ({
      ...t,
      estimatedPrice: Math.round(baseFare * t.multiplier),
    }));
  }

  getRides(): UberRide[] {
    return ridesStore;
  }

  requestRide(data: { pickup: string; destination: string; tier: UberTier; fare: number }): UberRide {
    const randomDriver = mockDrivers[Math.floor(Math.random() * mockDrivers.length)];
    const newRide: UberRide = {
      id: `ride-${Date.now()}`,
      pickup: data.pickup,
      destination: data.destination,
      tier: data.tier,
      fare: data.fare,
      status: 'driver_assigned',
      driverName: randomDriver.name,
      driverCar: randomDriver.car,
      driverLicense: randomDriver.license,
      driverRating: randomDriver.rating,
      driverAvatar: randomDriver.avatar,
      etaMins: 3,
      createdAt: new Date().toISOString(),
    };

    ridesStore.unshift(newRide);
    return newRide;
  }

  cancelRide(id: string): UberRide | null {
    const ride = ridesStore.find((r) => r.id === id);
    if (!ride) return null;
    ride.status = 'cancelled';
    return ride;
  }
}

export const uberRepository = new UberRepository();
