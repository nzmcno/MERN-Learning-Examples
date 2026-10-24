'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Flame,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Search,
  UserPlus,
  Dumbbell,
  Bike,
  Sparkles,
} from 'lucide-react';
import { ExerciseLog, ExerciseUser, TrackerStats, ExerciseCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { apiFetch } from '@/lib/api-client';

const categoryIcons: Record<ExerciseCategory, React.ReactNode> = {
  Running: <Flame className="h-4 w-4 text-orange-500" />,
  Gym: <Dumbbell className="h-4 w-4 text-indigo-500" />,
  Cycling: <Bike className="h-4 w-4 text-sky-500" />,
  Swimming: <Activity className="h-4 w-4 text-cyan-500" />,
  Yoga: <Sparkles className="h-4 w-4 text-emerald-500" />,
  Other: <Activity className="h-4 w-4 text-zinc-500" />,
};

export function TrackerView() {
  const [users, setUsers] = useState<ExerciseUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  const [stats, setStats] = useState<TrackerStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseLog | null>(null);

  // Form states
  const [exerciseForm, setExerciseForm] = useState({
    username: '',
    description: '',
    category: 'Gym' as ExerciseCategory,
    duration: 30,
    date: '',
  });

  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    targetDailyMinutes: 45,
  });

  useEffect(() => {
    let isCancelled = false;
    async function loadTrackerData() {
      try {
        const usersData = await apiFetch<ExerciseUser[]>('/api/tracker/users');
        if (isCancelled) return;
        setUsers(usersData);

        const queryParams = new URLSearchParams();
        if (selectedUser !== 'all') queryParams.append('username', selectedUser);
        if (selectedCategory !== 'all') queryParams.append('category', selectedCategory);

        const exercisesData = await apiFetch<ExerciseLog[]>(`/api/tracker/exercises?${queryParams.toString()}`);
        if (isCancelled) return;
        setExercises(exercisesData);

        const statsData = await apiFetch<TrackerStats>(
          `/api/tracker/stats${selectedUser !== 'all' ? `?username=${selectedUser}` : ''}`
        );
        if (isCancelled) return;
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load tracker data', err);
      }
    }
    loadTrackerData();
    return () => {
      isCancelled = true;
    };
  }, [selectedUser, selectedCategory, refreshTrigger]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser = await apiFetch<ExerciseUser>('/api/tracker/users', {
        method: 'POST',
        body: JSON.stringify(userForm),
      });
      setUsers((prev) => [...prev, newUser]);
      setSelectedUser(newUser.username);
      setExerciseForm((prev) => ({ ...prev, username: newUser.username }));
      setIsUserModalOpen(false);
      setUserForm({ username: '', email: '', targetDailyMinutes: 45 });
    } catch (err) {
      console.error('Failed to create user', err);
      alert('Error creating user');
    }
  };

  const handleCreateOrUpdateExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExercise) {
        await apiFetch(`/api/tracker/exercises/${editingExercise.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            description: exerciseForm.description,
            category: exerciseForm.category,
            duration: Number(exerciseForm.duration),
            date: exerciseForm.date,
            username: exerciseForm.username,
          }),
        });
      } else {
        await apiFetch('/api/tracker/exercises', {
          method: 'POST',
          body: JSON.stringify(exerciseForm),
        });
      }

      setIsLogModalOpen(false);
      setEditingExercise(null);
      setExerciseForm({
        username: users[0]?.username || '',
        description: '',
        category: 'Gym',
        duration: 30,
        date: new Date().toISOString().split('T')[0],
      });
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to save exercise', err);
      alert('Error saving exercise');
    }
  };

  const handleDeleteExercise = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exercise log?')) return;
    try {
      await apiFetch(`/api/tracker/exercises/${id}`, { method: 'DELETE' });
      setExercises((prev) => prev.filter((e) => e.id !== id));
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to delete exercise', err);
    }
  };

  const openEditModal = (ex: ExerciseLog) => {
    setEditingExercise(ex);
    setExerciseForm({
      username: ex.username,
      description: ex.description,
      category: ex.category,
      duration: ex.duration,
      date: new Date(ex.date).toISOString().split('T')[0],
    });
    setIsLogModalOpen(true);
  };

  const filteredExercises = exercises.filter((ex) =>
    ex.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Dumbbell className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                Exercise Tracker 2026
              </h1>
              <p className="text-xs text-zinc-500">
                Evolved from legacy MERN into Next.js 16 + Hono + Drizzle + TypeScript
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* User selector */}
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Athletes ({users.length})</option>
            {users.map((u) => (
              <option key={u.id} value={u.username}>
                {u.username} ({u.targetDailyMinutes}m target)
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUserModalOpen(true)}
            className="gap-1.5"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setEditingExercise(null);
              setExerciseForm({
                username: users[0]?.username || '',
                description: '',
                category: 'Gym',
                duration: 30,
                date: new Date().toISOString().split('T')[0],
              });
              setIsLogModalOpen(true);
            }}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Log Workout</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="p-4 pb-1">
              <span className="text-xs font-semibold text-zinc-500">Total Active Time</span>
              <CardTitle className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.totalMinutes} <span className="text-sm font-medium text-zinc-500">mins</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-xs text-zinc-500">
              Avg {(stats.totalMinutes / (stats.totalExercises || 1)).toFixed(0)}m per session
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader className="p-4 pb-1">
              <span className="text-xs font-semibold text-zinc-500">Workouts Logged</span>
              <CardTitle className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {stats.totalExercises}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-xs text-zinc-500">
              Across {Object.values(stats.categoryBreakdown).filter((v) => v > 0).length} categories
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="p-4 pb-1">
              <span className="text-xs font-semibold text-zinc-500">Est. Calories</span>
              <CardTitle className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {stats.estimatedCalories.toLocaleString()} <span className="text-sm font-medium text-zinc-500">kcal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-xs text-zinc-500">
              ~8.5 kcal per active minute
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-rose-500">
            <CardHeader className="p-4 pb-1">
              <span className="text-xs font-semibold text-zinc-500">Active Streak</span>
              <CardTitle className="text-2xl font-black text-rose-600 dark:text-rose-400">
                {stats.activeStreakDays} <span className="text-sm font-medium text-zinc-500">days</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-xs text-zinc-500">
              🔥 Keep up the momentum!
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 p-3 border border-zinc-200 dark:border-zinc-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search exercises by description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'Running', 'Gym', 'Cycling', 'Swimming', 'Yoga'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Table / List */}
      <Card>
        <CardHeader className="p-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">
              Activity History ({filteredExercises.length})
            </CardTitle>
            <span className="text-xs text-zinc-400">Synchronized via Hono REST API</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredExercises.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-sm">
              No exercises match your current filters. Click <strong>Log Workout</strong> to add one!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Athlete</th>
                    <th className="py-3 px-4">Workout</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredExercises.map((ex) => (
                    <tr key={ex.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                          {ex.username.charAt(0).toUpperCase()}
                        </span>
                        <span>{ex.username}</span>
                      </td>
                      <td className="py-3 px-4 text-zinc-800 dark:text-zinc-200 font-medium">
                        {ex.description}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 font-semibold text-zinc-700 dark:text-zinc-300">
                          {categoryIcons[ex.category]}
                          <span>{ex.category}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-600 dark:text-zinc-300 font-semibold">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-zinc-400" />
                          <span>{ex.duration} mins</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                          <span>{new Date(ex.date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(ex)}
                            className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteExercise(ex.id)}
                            className="h-7 w-7 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log / Edit Exercise Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title={editingExercise ? 'Edit Workout Session' : 'Log New Workout'}
        description="Recorded with type-safe Zod validation into Drizzle ORM"
      >
        <form onSubmit={handleCreateOrUpdateExercise} className="space-y-4">
          <div>
            <label className="text-xs font-semibold">Athlete</label>
            <select
              value={exerciseForm.username}
              onChange={(e) => setExerciseForm({ ...exerciseForm, username: e.target.value })}
              required
              className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {users.map((u) => (
                <option key={u.id} value={u.username}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold">Description</label>
            <Input
              required
              placeholder="e.g. 5km Morning Run, Bench Press 5x5..."
              value={exerciseForm.description}
              onChange={(e) => setExerciseForm({ ...exerciseForm, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold">Category</label>
              <select
                value={exerciseForm.category}
                onChange={(e) =>
                  setExerciseForm({ ...exerciseForm, category: e.target.value as ExerciseCategory })
                }
                className="mt-1 w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Running">Running</option>
                <option value="Gym">Gym</option>
                <option value="Cycling">Cycling</option>
                <option value="Swimming">Swimming</option>
                <option value="Yoga">Yoga</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold">Duration (Minutes)</label>
              <Input
                type="number"
                min="1"
                required
                value={exerciseForm.duration}
                onChange={(e) => setExerciseForm({ ...exerciseForm, duration: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold">Date</label>
            <Input
              type="date"
              required
              value={exerciseForm.date}
              onChange={(e) => setExerciseForm({ ...exerciseForm, date: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {editingExercise ? 'Update Workout' : 'Log Workout'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add User Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Create New Athlete Profile"
        description="Add a new user to track daily exercise and fitness goals"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="text-xs font-semibold">Username</label>
            <Input
              required
              placeholder="e.g. runner_jane"
              value={userForm.username}
              onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Email (Optional)</label>
            <Input
              type="email"
              placeholder="athlete@example.com"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Daily Target Active Minutes</label>
            <Input
              type="number"
              min="10"
              max="300"
              required
              value={userForm.targetDailyMinutes}
              onChange={(e) =>
                setUserForm({ ...userForm, targetDailyMinutes: Number(e.target.value) })
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsUserModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Save Athlete
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
