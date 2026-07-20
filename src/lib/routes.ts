import { getConcept, type Concept } from '../data/concepts'

export type RouteMatch =
  | { kind: 'home' }
  | { kind: 'concept'; concept: Concept }
  | { kind: 'not-found' }

export function normalizePathname(pathname: string): string {
  if (pathname === '/') return pathname
  return pathname.replace(/\/+$/, '') || '/'
}

export function resolveRoute(pathname: string): RouteMatch {
  const normalized = normalizePathname(pathname)
  if (normalized === '/') return { kind: 'home' }

  const slug = normalized.slice(1)
  const concept = getConcept(slug)
  return concept ? { kind: 'concept', concept } : { kind: 'not-found' }
}
