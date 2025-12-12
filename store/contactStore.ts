import { create } from 'zustand';

interface ContactState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // We can add other UI state here later, like "filterByState" or "viewMode"
}

export const useContactStore = create<ContactState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));