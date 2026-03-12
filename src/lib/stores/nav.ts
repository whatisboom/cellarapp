import { create } from 'zustand'

interface NavStore {
  open: boolean
  toggle: () => void
  close: () => void
}

export const useNavStore = create<NavStore>()((set) => ({
  open: false,
  toggle: () => set((state) => ({ open: !state.open })),
  close: () => set({ open: false }),
}))
