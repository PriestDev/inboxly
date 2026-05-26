import { create } from 'zustand';

export const useOfflineStore = create((set) => ({
  isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
  setOnline: (isOnline) => set({ isOnline })
}));

// Initialize offline detection
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useOfflineStore.setState({ isOnline: true }));
  window.addEventListener('offline', () => useOfflineStore.setState({ isOnline: false }));
}
