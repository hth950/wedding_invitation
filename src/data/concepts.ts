export const concepts = [
  {
    slug: 'concept-a',
    code: 'A',
    title: 'Our Moment Letter',
    koreanTitle: '우리의 순간',
    summary: '연한 핑크 종이 위 풀스크린 사진과 천천히 흐르는 순간을 담은 대표 시안',
  },
  {
    slug: 'concept-b',
    code: 'B',
    title: 'Quiet Paper Letter',
    koreanTitle: '고요한 종이 편지',
    summary: '아이보리 종이와 차분한 사진 배치에 집중한 정적인 편지 시안',
  },
  {
    slug: 'concept-c',
    code: 'C',
    title: 'Mist Blue Journal',
    koreanTitle: '미스트 블루 저널',
    summary: '아이보리와 옅은 블루, 둥근 사진 카드로 엮은 차분한 웨딩 저널',
  },
] as const

export type Concept = (typeof concepts)[number]
export type ConceptSlug = Concept['slug']

export function getConcept(slug: string): Concept | undefined {
  return concepts.find((concept) => concept.slug === slug)
}
