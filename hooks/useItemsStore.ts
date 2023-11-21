import { Movie, TVShow } from '@prisma/client'
import { create } from 'zustand'
import {persist } from 'zustand/middleware'

interface ItemsState {
  movies: Movie[]
  setMovies: (newItems: any) => void
  clearMovies: () => void
  TVs: TVShow[]
  setTVs: (newItems: any) => void
  clearTVs: () => void
  pageM: number
  setPageM: (newPage: number) => void
  resetPageM: () => void
  showM: boolean
  setShowM: (viewed: boolean) => void
  pageT: number
  setPageT: (newPage: number) => void
  resetPageT: () => void
  showT: boolean
  setShowT: (viewed: boolean) => void
  sort: boolean
  setSort: (sort: boolean) => void
}

export const useItemsStore = create<ItemsState>()(
      (set) => ({
        movies: [],
        setMovies: (newItems) => set((state) => ({ movies: state.movies.concat(newItems) })),
        clearMovies: () => set((state) => ({ movies: [] })),
        TVs: [],
        setTVs: (newItems) => set((state) => ({ TVs: state.TVs.concat(newItems) })),
        clearTVs: () => set((state) => ({ TVs: [] })),
        pageM: 1,
        setPageM: (newPage) => set((state) => ({ pageM: newPage })),
        resetPageM: () => set((state) => ({ pageM: 1 })),
        showM: true,
        setShowM: (viewed) => set((state) => ({ showM: viewed })),
        pageT: 1,
        setPageT: (newPage) => set((state) => ({ pageT: newPage })),
        resetPageT: () => set((state) => ({ pageT: 1 })),
        showT: true,
        setShowT: (viewed) => set((state) => ({ showT: viewed })),
        sort: false,
        setSort: (sort) => set((state) => ({ sort: sort })),
      })
)