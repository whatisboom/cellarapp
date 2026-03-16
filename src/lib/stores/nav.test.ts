import { describe, it, expect, beforeEach } from 'vitest'
import { useNavStore } from './nav'

describe('useNavStore', () => {
  beforeEach(() => {
    useNavStore.setState({ open: false })
  })

  it('toggles open', () => {
    useNavStore.getState().toggle()
    expect(useNavStore.getState().open).toBe(true)
  })

  it('close sets open to false', () => {
    useNavStore.setState({ open: true })
    useNavStore.getState().close()
    expect(useNavStore.getState().open).toBe(false)
  })
})
