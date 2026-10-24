'use client';

import React, { useState, useEffect } from 'react';
import {
  Car,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  Compass,
  ArrowRight,
  Navigation,
} from 'lucide-react';
import { UberRide, UberRideOption, UberTier } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiFetch } from '@/lib/api-client';

const quickDestinations = [
  'SFO International Airport',
  'Downtown Financial District, SF',
  'Golden Gate Bridge Vista Point',
  'Fisherman\'s Wharf Pier 39',
  'Mission Dolores Park',
];

export function UberView() {
  const [pickup, setPickup] = useState('Market St & 4th St, San Francisco');
  const [destination, setDestination] = useState('SFO International Airport');
  const [tierOptions, setTierOptions] = useState<UberRideOption[]>([]);
  const [selectedTier, setSelectedTier] = useState<UberTier>('UberX');
  const [activeRide, setActiveRide] = useState<UberRide | null>(null);
  const [rideHistory, setRideHistory] = useState<UberRide[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoadingEstimates, setIsLoadingEstimates] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    async function loadInitial() {
      setIsLoadingEstimates(true);
      try {
        const query = new URLSearchParams({ pickup, destination });
        const data = await apiFetch<UberRideOption[]>(`/api/uber/estimates?${query.toString()}`);
        setTierOptions(data);

        const history = await apiFetch<UberRide[]>('/api/uber/rides');
        setRideHistory(history);
      } catch (err) {
        console.error('Failed to load Uber estimates', err);
      } finally {
        setIsLoadingEstimates(false);
      }
    }
    loadInitial();
  }, [pickup, destination]);

  const currentOption = tierOptions.find((t) => t.tier === selectedTier) || tierOptions[0];

  const handleRequestRide = async () => {
    if (!currentOption) return;
    setIsRequesting(true);

    try {
      const newRide = await apiFetch<UberRide>('/api/uber/request', {
        method: 'POST',
        body: JSON.stringify({
          pickup,
          destination,
          tier: selectedTier,
          fare: currentOption.estimatedPrice,
        }),
      });

      setActiveRide(newRide);
      setRideHistory((prev) => [newRide, ...prev]);
    } catch (err) {
      console.error('Failed to request ride', err);
      alert('Error booking ride');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleCancelRide = async () => {
    if (!activeRide) return;
    try {
      await apiFetch(`/api/uber/rides/${activeRide.id}/cancel`, { method: 'POST' });
      setActiveRide(null);
    } catch (err) {
      console.error('Failed to cancel ride', err);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white font-black text-xl shadow-md">
            Uber
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Uber Ride Dispatch 2026
            </h1>
            <p className="text-xs text-zinc-500">
              Interactive ride booking, dynamic fare matrix & real-time driver dispatch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsHistoryOpen(true)}
            className="text-xs gap-1.5"
          >
            <Clock className="h-4 w-4" />
            <span>Trip History ({rideHistory.length})</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Ride Setup Form */}
        <div className="space-y-5 lg:col-span-5">
          <Card className="p-5 shadow-sm border-zinc-200 dark:border-zinc-800">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <Navigation className="h-4 w-4 text-indigo-600" />
              <span>Where to?</span>
            </h2>

            {/* Inputs with connecting line */}
            <div className="relative space-y-3 pl-6">
              <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-zinc-300 dark:bg-zinc-700" />
              <div className="absolute left-[5px] top-3 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
              <div className="absolute left-[5px] bottom-3 h-2.5 w-2.5 rounded-sm bg-black dark:bg-white" />

              <div>
                <label className="text-[11px] font-semibold text-zinc-500">Pickup Location</label>
                <Input
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-500">Destination</label>
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>
            </div>

            {/* Quick Destination Pills */}
            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] font-semibold text-zinc-400 block mb-2">
                Popular destinations
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickDestinations.map((dest) => (
                  <button
                    key={dest}
                    onClick={() => setDestination(dest)}
                    className="rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-2.5 py-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {dest.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Ride Tier Selector */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Available Ride Tiers
            </h3>

            {isLoadingEstimates ? (
              <div className="p-8 text-center text-xs text-zinc-500">
                Calculating fastest routes and real-time fares...
              </div>
            ) : (
              tierOptions.map((opt) => (
                <div
                  key={opt.tier}
                  onClick={() => setSelectedTier(opt.tier)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedTier === opt.tier
                      ? 'border-black dark:border-white bg-zinc-50 dark:bg-zinc-800/80 shadow-sm scale-[1.01]'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      <Car className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          {opt.title}
                        </span>
                        <span className="text-[11px] text-zinc-500 flex items-center gap-0.5">
                          • {opt.etaMins}m away
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 line-clamp-1">{opt.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-base text-zinc-900 dark:text-zinc-100">
                      ${opt.estimatedPrice}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                      Guaranteed Fare
                    </span>
                  </div>
                </div>
              ))
            )}

            {/* Request Button */}
            {!activeRide ? (
              <Button
                onClick={handleRequestRide}
                disabled={isRequesting || !currentOption}
                className="w-full h-12 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-black text-white font-bold text-sm rounded-2xl gap-2 mt-4 shadow-lg"
              >
                <span>{isRequesting ? 'Dispatching driver...' : `Request ${selectedTier}`}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={handleCancelRide}
                className="w-full h-12 rounded-2xl font-bold text-sm mt-4"
              >
                Cancel Current Ride
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Simulated Map & Active Driver Status */}
        <div className="space-y-5 lg:col-span-7">
          {/* Simulated Map Canvas */}
          <div className="relative h-[360px] sm:h-[420px] w-full rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900 shadow-lg">
            {/* Map styling grid */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Roads & Navigation Lines */}
            <svg className="absolute inset-0 h-full w-full stroke-zinc-700/60 stroke-2" fill="none">
              <path d="M 50 180 Q 200 80 340 190 T 520 280" />
              <path d="M 120 40 L 220 320" />
              <path d="M 40 300 Q 250 240 500 120" />
              {/* Highlighted Route Path */}
              <path
                d="M 100 240 Q 240 160 380 200 T 480 140"
                className="stroke-indigo-500 stroke-[5] stroke-linecap-round stroke-dasharray-[8,4] animate-pulse"
              />
            </svg>

            {/* Pickup Pin */}
            <div className="absolute left-[90px] top-[220px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="rounded-full bg-emerald-500 text-white p-2 shadow-xl ring-4 ring-emerald-500/30">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="mt-1 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                Pickup
              </span>
            </div>

            {/* Destination Pin */}
            <div className="absolute left-[470px] top-[120px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="rounded-full bg-rose-500 text-white p-2 shadow-xl ring-4 ring-rose-500/30">
                <Compass className="h-4 w-4" />
              </div>
              <span className="mt-1 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                Destination
              </span>
            </div>

            {/* Moving Driver Car */}
            <div className="absolute left-[260px] top-[170px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce duration-1000">
              <div className="rounded-2xl bg-black dark:bg-white text-white dark:text-black p-2.5 shadow-2xl border-2 border-indigo-400">
                <Car className="h-5 w-5" />
              </div>
              <span className="mt-1 rounded-full bg-indigo-600 px-2 py-0.5 text-[9px] font-extrabold text-white">
                3 mins away
              </span>
            </div>

            {/* Safety & Realtime Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/75 backdrop-blur-md px-3.5 py-1.5 text-xs text-white border border-white/10">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Uber GPS Telemetry Live</span>
            </div>
          </div>

          {/* Active Ride Card */}
          {activeRide && (
            <Card className="border-2 border-indigo-500/50 bg-gradient-to-r from-indigo-50/50 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 p-5 shadow-xl">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                      Driver is heading to pickup location
                    </span>
                  </div>
                  <Badge variant="outline">Arriving in {activeRide.etaMins} mins</Badge>
                </div>

                <div className="flex items-center justify-between border-t border-b border-zinc-200 dark:border-zinc-800 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeRide.driverAvatar}
                      alt={activeRide.driverName}
                      className="h-12 w-12 rounded-full object-cover border-2 border-indigo-500"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {activeRide.driverName}
                      </h4>
                      <p className="text-xs text-zinc-500">{activeRide.driverCar}</p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold mt-0.5">
                        <Star className="h-3 w-3 fill-amber-500" />
                        <span>{activeRide.driverRating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-black font-mono font-bold px-2.5 py-1 text-xs shadow-sm">
                      {activeRide.driverLicense}
                    </span>
                    <span className="block text-[11px] text-zinc-400 mt-1 font-semibold">
                      ${activeRide.fare} Fixed
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Pickup: {activeRide.pickup.split(',')[0]}</span>
                  <span>Dest: {activeRide.destination.split(',')[0]}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Trip History Modal */}
      <Modal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title="Completed Uber Rides"
        description="Records of your recent trips and rides"
      >
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {rideHistory.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">No past rides recorded.</p>
          ) : (
            rideHistory.map((ride) => (
              <div
                key={ride.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs"
              >
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">
                    {ride.destination.split(',')[0]}
                  </div>
                  <div className="text-zinc-500 text-[11px]">From {ride.pickup.split(',')[0]}</div>
                  <div className="text-[10px] text-zinc-400 mt-1">{ride.driverCar}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm">${ride.fare}</div>
                  <Badge variant={ride.status === 'completed' ? 'success' : 'secondary'}>
                    {ride.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
