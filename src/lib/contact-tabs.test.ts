import { describe, expect, it } from 'vitest'
import { getNextContactSide } from './contact-tabs'

describe('contact accordion tabs', () => {
  it('moves between the groom and bride tabs with arrow keys', () => {
    expect(getNextContactSide('groom', 'ArrowRight')).toBe('bride')
    expect(getNextContactSide('bride', 'ArrowRight')).toBe('groom')
    expect(getNextContactSide('bride', 'ArrowLeft')).toBe('groom')
    expect(getNextContactSide('groom', 'ArrowUp')).toBe('bride')
  })

  it('supports Home and End while ignoring unrelated keys', () => {
    expect(getNextContactSide('bride', 'Home')).toBe('groom')
    expect(getNextContactSide('groom', 'End')).toBe('bride')
    expect(getNextContactSide('groom', 'Enter')).toBeNull()
  })
})
