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
    title: 'Our Moving Moment',
    koreanTitle: '움직이는 우리의 순간',
    summary: '첫빛의 편지 위로 실제 사진이 두 장면처럼 움직이는 핑크 콜라주',
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
