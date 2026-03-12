import { describe, it, expect, beforeEach } from 'vitest'
import { useNotificationStore } from './notifications'

describe('notification store', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [] })
  })

  it('adds a notification', () => {
    useNotificationStore.getState().add('Beer added!', 'success')
    const { notifications } = useNotificationStore.getState()
    expect(notifications).toHaveLength(1)
    expect(notifications[0]!.message).toBe('Beer added!')
    expect(notifications[0]!.type).toBe('success')
  })

  it('dismisses a notification', () => {
    useNotificationStore.getState().add('Test', 'info')
    const { notifications } = useNotificationStore.getState()
    useNotificationStore.getState().dismiss(notifications[0]!.id)
    expect(useNotificationStore.getState().notifications).toHaveLength(0)
  })

  it('handles error notifications', () => {
    useNotificationStore.getState().add('Something failed', 'error')
    const { notifications } = useNotificationStore.getState()
    expect(notifications[0]!.type).toBe('error')
  })
})
