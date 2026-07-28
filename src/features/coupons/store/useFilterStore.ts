/**
 * Filter/search UI state store.
 * Separated from coupon data to avoid unnecessary re-renders.
 */

import { create } from 'zustand';
import { CouponFilterType } from '../types';

interface FilterStoreState {
  searchQuery: string;
  activeFilter: CouponFilterType;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: CouponFilterType) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStoreState>((set) => ({
  searchQuery: '',
  activeFilter: 'all',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilter: (filter) => set({ activeFilter: filter }),
  resetFilters: () => set({ searchQuery: '', activeFilter: 'all' }),
}));
