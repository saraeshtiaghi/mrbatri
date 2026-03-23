"use client";

import { create } from 'zustand';

export type SortOption = 'newest' | 'price_asc' | 'price_desc';

interface FilterState {
    selectedCategory: string;
    sortBy: SortOption;
    searchQuery: string; // NEW
    setSelectedCategory: (category: string) => void;
    setSortBy: (sort: SortOption) => void;
    setSearchQuery: (query: string) => void; // NEW
}

export const useFilterStore = create<FilterState>((set) => ({
    selectedCategory: 'all',
    sortBy: 'newest',
    searchQuery: '', // Default to empty string
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    setSortBy: (sortBy) => set({ sortBy }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
}));