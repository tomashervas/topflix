import { Movie, TVShow } from '@prisma/client'
import { create } from 'zustand'
import {persist } from 'zustand/middleware'

interface ItemsState {
  items: any
  setItems: (newItems: any) => void
  clearItems: () => void
  page: number
  setPage: (newPage: number) => void,
  resetPage: () => void
}

const useBearStore = create<ItemsState>()(
    persist(
      (set) => ({
        items: [],
        setItems: (newItems) => set((state) => ({ items: state.items.concat(newItems) })),
        clearItems: () => set((state) => ({ items: [] })),
        page: 1,
        setPage: (newPage) => set((state) => ({ page: newPage })),
        resetPage: () => set((state) => ({ page: 1 })),
      }),
      {
        name: 'items-storage',
      },
  ),
)