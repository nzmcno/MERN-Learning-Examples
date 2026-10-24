import { create } from 'zustand';

interface AppState {
  isMuted: boolean;
  toggleMute: () => void;
  activeApp: 'tinder' | 'tiktok' | 'tracker' | 'hub';
  setActiveApp: (app: 'tinder' | 'tiktok' | 'tracker' | 'hub') => void;
  currentUser: string;
  setCurrentUser: (username: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isMuted: true,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  activeApp: 'hub',
  setActiveApp: (app) => set({ activeApp: app }),
  currentUser: 'alex_runner',
  setCurrentUser: (username) => set({ currentUser: username }),
}));
