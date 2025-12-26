import { create } from 'zustand'

interface UIState {
  loaderVisible: boolean
  setLoaderVisible: (visible: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  loaderVisible: true,
  setLoaderVisible: (loaderVisible) => set({ loaderVisible }),
}))
