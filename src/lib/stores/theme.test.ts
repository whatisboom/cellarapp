import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from './theme'

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: 'light' })
  })

  it('defaults to light mode', () => {
    expect(useThemeStore.getState().mode).toBe('light')
  })

  it('toggles light to dark', () => {
    useThemeStore.getState().toggle()
    expect(useThemeStore.getState().mode).toBe('dark')
  })

  it('toggles dark back to light', () => {
    useThemeStore.setState({ mode: 'dark' })
    useThemeStore.getState().toggle()
    expect(useThemeStore.getState().mode).toBe('light')
  })
})
