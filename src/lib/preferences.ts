export const LARGE_TEXT_STORAGE_KEY = 'wedding-invitation:large-text'

export function parseLargeTextPreference(value: string | null): boolean {
  return value === 'true'
}

export function readLargeTextPreference(): boolean {
  try {
    return parseLargeTextPreference(window.localStorage.getItem(LARGE_TEXT_STORAGE_KEY))
  } catch {
    return false
  }
}

export function writeLargeTextPreference(enabled: boolean): void {
  try {
    window.localStorage.setItem(LARGE_TEXT_STORAGE_KEY, String(enabled))
  } catch {
    // The control should still work when an in-app browser blocks storage.
  }
}
