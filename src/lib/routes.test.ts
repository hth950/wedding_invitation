import { describe, expect, it } from 'vitest'
import { concepts } from '../data/concepts'
import { normalizePathname, resolveRoute } from './routes'

describe('concept routes', () => {
  it('exposes exactly three distinct concept routes', () => {
    expect(concepts).toHaveLength(3)
    expect(new Set(concepts.map(({ slug }) => slug)).size).toBe(3)
  })

  it.each(concepts)('resolves /$slug', ({ slug, title }) => {
    expect(resolveRoute(`/${slug}`)).toMatchObject({
      kind: 'concept',
      concept: { slug, title },
    })
  })

  it('supports trailing slashes and rejects unknown routes', () => {
    expect(normalizePathname('/concept-a///')).toBe('/concept-a')
    expect(resolveRoute('/concept-a/').kind).toBe('concept')
    expect(resolveRoute('/not-a-concept')).toEqual({ kind: 'not-found' })
  })
})
