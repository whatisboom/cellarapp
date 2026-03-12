import { create } from 'zustand'

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface NotificationStore {
  notifications: Notification[]
  add: (message: string, type: Notification['type']) => void
  dismiss: (id: string) => void
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
  notifications: [],
  add: (message, type) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: `${Date.now()}-${Math.random()}`, message, type },
      ],
    })),
  dismiss: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}))
