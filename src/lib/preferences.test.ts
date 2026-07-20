import { describe, expect, it } from 'vitest'
import { parseLargeTextPreference } from './preferences'

describe('large-text preference', () => {
  it('only enables large text for the explicit stored value', () => {
    expect(parseLargeTextPreference('true')).toBe(true)
    expect(parseLargeTextPreference('false')).toBe(false)
    expect(parseLargeTextPreference(null)).toBe(false)
    expect(parseLargeTextPreference('1')).toBe(false)
  })
})
