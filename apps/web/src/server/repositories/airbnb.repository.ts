import { AirbnbListing, AirbnbReservation } from '@/types';

const initialListings: AirbnbListing[] = [
  {
    id: 'ab-1',
    title: 'Cliffside Villa with Infinite Aegean Sea Views',
    description: 'Breathtaking cave-style luxury villa perched above the caldera in Oia. Includes private heated infinity pool, sunset terrace, and daily chef-prepared Greek breakfast.',
    category: 'Beachfront',
    location: 'Oia, Santorini, Greece',
    pricePerNight: 480,
    rating: 4.98,
    reviewsCount: 142,
    imageUrls: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=800&q=80',
    ],
    hostName: 'Kostas & Elena',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isSuperhost: true,
    isFavorite: false,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ab-2',
    title: 'Modern Nordic A-Frame Glass Cabin in Aspen Woods',
    description: 'Immerse in nature surrounded by towering pines and alpine peaks. Features radiant floor heating, wood-burning stove, cedar barrel hot tub, and ski-in/ski-out access.',
    category: 'Cabins',
    location: 'Aspen, Colorado, United States',
    pricePerNight: 320,
    rating: 4.95,
    reviewsCount: 88,
    imageUrls: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    ],
    hostName: 'Wyatt & Clara',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isSuperhost: true,
    isFavorite: true,
    maxGuests: 5,
    bedrooms: 3,
    bathrooms: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ab-3',
    title: 'Historic Traditional Machiya Townhouse with Zen Garden',
    description: 'Restored 100-year-old architectural jewel in the heart of Gion. Tatami mat tea room, hinoki cedar wood soaking bath, and serene moss rock garden.',
    category: 'Iconic Cities',
    location: 'Kyoto, Kansai, Japan',
    pricePerNight: 260,
    rating: 4.97,
    reviewsCount: 210,
    imageUrls: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    ],
    hostName: 'Kenji Takahashi',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isSuperhost: true,
    isFavorite: false,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ab-4',
    title: 'Ultra-Modern Minimalist Villa with Olympic Infinity Pool',
    description: 'Designer estate featured in Architectural Digest. Floor-to-ceiling glass walls, 25-meter cantilevered infinity pool, private cinema, and panoramic valley vista.',
    category: 'Amazing Pools',
    location: 'Ibiza, Balearic Islands, Spain',
    pricePerNight: 750,
    rating: 4.99,
    reviewsCount: 64,
    imageUrls: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    ],
    hostName: 'Mateo De Luca',
    hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    isSuperhost: true,
    isFavorite: false,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 5,
    createdAt: new Date().toISOString(),
  },
];

const listingsStore: AirbnbListing[] = [...initialListings];
const reservationsStore: AirbnbReservation[] = [];

export class AirbnbRepository {
  getAll(category?: string, search?: string): AirbnbListing[] {
    let result = [...listingsStore];
    if (category && category !== 'All') {
      result = result.filter((l) => l.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) => l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getById(id: string): AirbnbListing | null {
    return listingsStore.find((l) => l.id === id) || null;
  }

  createListing(data: Omit<AirbnbListing, 'id' | 'rating' | 'reviewsCount' | 'createdAt'>): AirbnbListing {
    const newListing: AirbnbListing = {
      ...data,
      id: `ab-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString(),
    };
    listingsStore.unshift(newListing);
    return newListing;
  }

  toggleFavorite(id: string): AirbnbListing | null {
    const listing = listingsStore.find((l) => l.id === id);
    if (!listing) return null;
    listing.isFavorite = !listing.isFavorite;
    return listing;
  }

  createReservation(data: {
    listingId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalNights: number;
  }): AirbnbReservation {
    const listing = this.getById(data.listingId);
    const pricePerNight = listing ? listing.pricePerNight : 200;
    const totalPrice = pricePerNight * data.totalNights + 65; // includes cleaning fee

    const reservation: AirbnbReservation = {
      id: `res-${Date.now()}`,
      listingId: data.listingId,
      listingTitle: listing?.title || 'Luxury Retreat',
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      totalNights: data.totalNights,
      totalPrice,
      createdAt: new Date().toISOString(),
    };

    reservationsStore.unshift(reservation);
    return reservation;
  }

  getReservations(): AirbnbReservation[] {
    return reservationsStore;
  }
}

export const airbnbRepository = new AirbnbRepository();
