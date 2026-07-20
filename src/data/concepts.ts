export const concepts = [
  {
    slug: 'concept-a',
    code: 'A',
    title: 'Black Cinema',
    koreanTitle: '블랙 시네마',
    summary: '어두운 영화 포스터와 챕터형 서사로 시작하는 강렬한 방향',
  },
  {
    slug: 'concept-b',
    code: 'B',
    title: 'Peach Family Archive',
    koreanTitle: '피치 패밀리 아카이브',
    summary: '가족의 오래된 사진과 손편지를 포근하게 엮는 기록물 방향',
  },
  {
    slug: 'concept-c',
    code: 'C',
    title: 'Minimal Handwritten Editorial',
    koreanTitle: '미니멀 핸드라이튼',
    summary: '넉넉한 여백과 섬세한 손글씨를 중심으로 한 편집물 방향',
  },
] as const

export type Concept = (typeof concepts)[number]
export type ConceptSlug = Concept['slug']

export function getConcept(slug: string): Concept | undefined {
  return concepts.find((concept) => concept.slug === slug)
}
