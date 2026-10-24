'use client';

import React, { useState, useEffect } from 'react';
import {
  Heart,
  Star,
  Search,
  Plus,
  Home,
  Check,
  Palmtree,
  Trees,
  Building2,
  Waves,
  Mountain,
} from 'lucide-react';
import { AirbnbListing, AirbnbCategory, AirbnbReservation } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { apiFetch } from '@/lib/api-client';

const categories: { label: AirbnbCategory | 'All'; icon: React.ReactNode }[] = [
  { label: 'All', icon: <Home className="h-5 w-5" /> },
  { label: 'Beachfront', icon: <Palmtree className="h-5 w-5" /> },
  { label: 'Cabins', icon: <Trees className="h-5 w-5" /> },
  { label: 'Iconic Cities', icon: <Building2 className="h-5 w-5" /> },
  { label: 'Amazing Pools', icon: <Waves className="h-5 w-5" /> },
  { label: 'Countryside', icon: <Mountain className="h-5 w-5" /> },
];

export function AirbnbView() {
  const [listings, setListings] = useState<AirbnbListing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<AirbnbListing | null>(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState<AirbnbReservation | null>(null);

  // Reservation form state
  const [reserveForm, setReserveForm] = useState({
    checkIn: '2026-11-10',
    checkOut: '2026-11-15',
    guests: 2,
  });

  // Host form state
  const [hostForm, setHostForm] = useState({
    title: '',
    description: '',
    category: 'Beachfront' as AirbnbCategory,
    location: '',
    pricePerNight: 240,
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    maxGuests: 4,
  });

  useEffect(() => {
    let isCancelled = false;
    async function loadListings() {
      try {
        const query = new URLSearchParams();
        if (selectedCategory !== 'All') query.append('category', selectedCategory);
        if (searchQuery) query.append('search', searchQuery);

        const data = await apiFetch<AirbnbListing[]>(`/api/airbnb/listings?${query.toString()}`);
        if (!isCancelled) {
          setListings(data);
        }
      } catch (err) {
        console.error('Failed to load Airbnb listings', err);
      }
    }
    loadListings();
    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, searchQuery]);

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await apiFetch<AirbnbListing>(`/api/airbnb/listings/${id}/favorite`, {
        method: 'POST',
      });
      setListings((prev) => prev.map((l) => (l.id === id ? updated : l)));
    } catch (err) {
      console.error('Favorite error', err);
    }
  };

  const handleBookReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;

    try {
      const res = await apiFetch<AirbnbReservation>('/api/airbnb/reservations', {
        method: 'POST',
        body: JSON.stringify({
          listingId: selectedListing.id,
          checkIn: reserveForm.checkIn,
          checkOut: reserveForm.checkOut,
          guests: Number(reserveForm.guests),
          totalNights: 5,
        }),
      });

      setReservationSuccess(res);
    } catch (err) {
      console.error('Booking error', err);
      alert('Error creating reservation');
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newListing = await apiFetch<AirbnbListing>('/api/airbnb/listings', {
        method: 'POST',
        body: JSON.stringify({
          title: hostForm.title,
          description: hostForm.description,
          category: hostForm.category,
          location: hostForm.location,
          pricePerNight: Number(hostForm.pricePerNight),
          imageUrls: [hostForm.imageUrl],
          maxGuests: Number(hostForm.maxGuests),
        }),
      });

      setListings((prev) => [newListing, ...prev]);
      setIsHostModalOpen(false);
      setHostForm({
        title: '',
        description: '',
        category: 'Beachfront',
        location: '',
        pricePerNight: 240,
        imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
        maxGuests: 4,
      });
    } catch (err) {
      console.error('Failed to create listing', err);
      alert('Error creating listing');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500 text-white font-black text-xl shadow-md">
            A
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Airbnb Escapes 2026
            </h1>
            <p className="text-xs text-zinc-500">
              Curated architectural villas, remote cabins & beachfront stays
            </p>
          </div>
        </div>

        {/* Search Input & Host Action */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search destinations (e.g. Greece, Aspen)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs rounded-full shadow-sm"
            />
          </div>

          <Button
            size="sm"
            onClick={() => setIsHostModalOpen(true)}
            className="rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold gap-1.5 shadow-md shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Airbnb your home</span>
          </Button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 border-b border-zinc-100 dark:border-zinc-800/80 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex flex-col items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all shrink-0 border-b-2 cursor-pointer ${
                isSelected
                  ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <div className={isSelected ? 'text-rose-500' : 'text-zinc-500'}>{cat.icon}</div>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Listing Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedListing(item);
              setReservationSuccess(null);
              setIsReserveModalOpen(true);
            }}
            className="group cursor-pointer space-y-3"
          >
            {/* Image Container with Favorite Button */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
              <img
                src={item.imageUrls[0]}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <button
                onClick={(e) => handleToggleFavorite(item.id, e)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white hover:scale-110 transition-transform cursor-pointer"
              >
                <Heart
                  className={`h-4 w-4 ${
                    item.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                  }`}
                />
              </button>

              {item.isSuperhost && (
                <div className="absolute left-3 top-3 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-extrabold text-zinc-900 dark:text-zinc-100 shadow">
                  Superhost
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-zinc-100">
                <span className="truncate pr-2">{item.location}</span>
                <div className="flex items-center gap-1 shrink-0 font-medium text-zinc-800 dark:text-zinc-200">
                  <Star className="h-3.5 w-3.5 fill-zinc-900 dark:fill-zinc-100" />
                  <span>{item.rating}</span>
                </div>
              </div>

              <p className="text-zinc-500 line-clamp-1">{item.title}</p>
              <p className="text-zinc-400 text-[11px]">Up to {item.maxGuests} guests • {item.bedrooms} bedrooms</p>

              <div className="pt-1">
                <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                  ${item.pricePerNight}
                </span>
                <span className="text-zinc-500 font-normal"> / night</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reservation Modal */}
      {selectedListing && (
        <Modal
          isOpen={isReserveModalOpen}
          onClose={() => setIsReserveModalOpen(false)}
          title={selectedListing.title}
          description={`${selectedListing.location} • Hosted by ${selectedListing.hostName}`}
          className="max-w-lg"
        >
          {reservationSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
              <h3 className="text-xl font-bold">Reservation Confirmed!</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                You are all set for {reservationSuccess.listingTitle} from {reservationSuccess.checkIn} to {reservationSuccess.checkOut}. Total paid: <strong>${reservationSuccess.totalPrice}</strong>.
              </p>
              <Button onClick={() => setIsReserveModalOpen(false)} className="rounded-xl font-bold">
                Close & Return
              </Button>
            </div>
          ) : (
            <form onSubmit={handleBookReservation} className="space-y-4">
              <img
                src={selectedListing.imageUrls[0]}
                alt={selectedListing.title}
                className="h-44 w-full rounded-2xl object-cover"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold">Check-in</label>
                  <Input
                    type="date"
                    required
                    value={reserveForm.checkIn}
                    onChange={(e) => setReserveForm({ ...reserveForm, checkIn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold">Checkout</label>
                  <Input
                    type="date"
                    required
                    value={reserveForm.checkOut}
                    onChange={(e) => setReserveForm({ ...reserveForm, checkOut: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold">Guests</label>
                <Input
                  type="number"
                  min="1"
                  max={selectedListing.maxGuests}
                  required
                  value={reserveForm.guests}
                  onChange={(e) => setReserveForm({ ...reserveForm, guests: Number(e.target.value) })}
                />
              </div>

              {/* Price Breakdown */}
              <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-3.5 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>${selectedListing.pricePerNight} x 5 nights</span>
                  <span>${selectedListing.pricePerNight * 5}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>$45</span>
                </div>
                <div className="flex justify-between">
                  <span>Airbnb service fee</span>
                  <span>$20</span>
                </div>
                <div className="flex justify-between border-t border-zinc-200 dark:border-zinc-700 pt-2 font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  <span>Total before taxes</span>
                  <span>${selectedListing.pricePerNight * 5 + 65}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md"
              >
                Reserve Stay
              </Button>
            </form>
          )}
        </Modal>
      )}

      {/* Host Home Modal */}
      <Modal
        isOpen={isHostModalOpen}
        onClose={() => setIsHostModalOpen(false)}
        title="Airbnb Your Home"
        description="Publish a new luxury listing on the platform"
      >
        <form onSubmit={handleCreateListing} className="space-y-4">
          <div>
            <label className="text-xs font-semibold">Property Title</label>
            <Input
              required
              placeholder="e.g. Modern Cliffside Villa with Panoramic Bay"
              value={hostForm.title}
              onChange={(e) => setHostForm({ ...hostForm, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold">Category</label>
              <select
                value={hostForm.category}
                onChange={(e) =>
                  setHostForm({ ...hostForm, category: e.target.value as AirbnbCategory })
                }
                className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs"
              >
                <option value="Beachfront">Beachfront</option>
                <option value="Cabins">Cabins</option>
                <option value="Iconic Cities">Iconic Cities</option>
                <option value="Amazing Pools">Amazing Pools</option>
                <option value="Countryside">Countryside</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold">Nightly Price ($)</label>
              <Input
                type="number"
                min="20"
                required
                value={hostForm.pricePerNight}
                onChange={(e) => setHostForm({ ...hostForm, pricePerNight: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold">Location</label>
            <Input
              required
              placeholder="e.g. Santorini, Greece"
              value={hostForm.location}
              onChange={(e) => setHostForm({ ...hostForm, location: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Image URL</label>
            <Input
              required
              placeholder="https://images.unsplash.com/..."
              value={hostForm.imageUrl}
              onChange={(e) => setHostForm({ ...hostForm, imageUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Description</label>
            <Input
              required
              placeholder="Tell guests about your place..."
              value={hostForm.description}
              onChange={(e) => setHostForm({ ...hostForm, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsHostModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white font-bold">
              Publish Listing
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
