export type ContactSide = 'groom' | 'bride'

const contactSides: ContactSide[] = ['groom', 'bride']

export function getNextContactSide(current: ContactSide, key: string): ContactSide | null {
  const currentIndex = contactSides.indexOf(current)
  if (key === 'Home') return contactSides[0]
  if (key === 'End') return contactSides.at(-1) ?? null
  if (key === 'ArrowRight' || key === 'ArrowDown') return contactSides[(currentIndex + 1) % contactSides.length]
  if (key === 'ArrowLeft' || key === 'ArrowUp') return contactSides[(currentIndex - 1 + contactSides.length) % contactSides.length]
  return null
}
