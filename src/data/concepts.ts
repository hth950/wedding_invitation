export const concepts = [
  {
    slug: 'concept-a',
    code: 'A',
    title: 'First Light Letter',
    koreanTitle: '첫빛의 편지',
    summary: '아이보리 종이와 은은한 핑크빛에 담은 따뜻한 편지',
  },
  {
    slug: 'concept-b',
    code: 'B',
    title: 'Midnight Cinema',
    koreanTitle: '미드나이트 시네마',
    summary: '차콜과 옥스블러드, 영화의 장면처럼 이어지는 초대',
  },
  {
    slug: 'concept-c',
    code: 'C',
    title: 'Anyang Modern Poster',
    koreanTitle: '안양 모던 포스터',
    summary: '코발트와 레드, 날짜와 길찾기를 선명하게 보여주는 포스터',
  },
] as const

export type Concept = (typeof concepts)[number]
export type ConceptSlug = Concept['slug']

export function getConcept(slug: string): Concept | undefined {
  return concepts.find((concept) => concept.slug === slug)
}
