export const WEDDING_DATE_ISO = '2027-02-20T14:00:00+09:00'

export const wedding = {
  groom: {
    name: '황태환',
    role: '신랑',
  },
  bride: {
    name: '하효진',
    role: '신부',
  },
  ceremony: {
    iso: WEDDING_DATE_ISO,
    dateLabel: '2027년 2월 20일 토요일',
    timeLabel: '오후 2시',
    shortDate: '2027. 02. 20',
    location: '안양역 인근',
    venue: '상세 예식장명 입력 예정',
    address: '상세 주소 입력 예정',
  },
  invitation: [
    '서로의 평범한 하루를 가장 다정하게 바라보던 두 사람이',
    '이제 같은 방향을 향해 오래도록 걸어가려 합니다.',
    '저희의 새로운 시작에 함께해 주시면 감사하겠습니다.',
  ],
  gallery: [
    { src: '/images/wedding/00028.webp', alt: '정면에 나란히 선 황태환, 하효진의 웨딩 사진' },
    { src: '/images/wedding/00187.webp', alt: '밝은 스튜디오에서 편안히 앉아 있는 두 사람' },
    { src: '/images/wedding/00371.webp', alt: '꽃을 든 하효진의 야외 웨딩 사진' },
    { src: '/images/wedding/00465.webp', alt: '햇살이 드는 공간에서 웃고 있는 두 사람' },
    { src: '/images/wedding/00704.webp', alt: '흰 건물 앞에서 서로를 바라보는 두 사람' },
    { src: '/images/wedding/00794.webp', alt: '계단에 앉아 활짝 웃고 있는 두 사람' },
    { src: '/images/wedding/00898.webp', alt: '정원 앞에서 나란히 선 두 사람의 전신 사진' },
    { src: '/images/wedding/00982.webp', alt: '야외에서 베일을 함께 들고 웃는 두 사람' },
    { src: '/images/wedding/01108.webp', alt: '정원 창가에서 부케를 든 황태환의 사진' },
    { src: '/images/wedding/01128.webp', alt: '창가에서 부케를 사이에 두고 서로 바라보는 두 사람' },
    { src: '/images/wedding/01782.webp', alt: '담쟁이 벽 골목을 함께 걷는 두 사람' },
    { src: '/images/wedding/01813.webp', alt: '붉은 벽돌과 나무 그림자 아래 나란히 선 두 사람' },
  ],
} as const

export function getDday(now = new Date()): string {
  const target = new Date(WEDDING_DATE_ISO)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weddingDay = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const days = Math.round((weddingDay.getTime() - today.getTime()) / 86_400_000)
  if (days === 0) return '오늘, 저희 결혼합니다'
  if (days > 0) return `결혼식까지 D-${days}`
  return `함께한 지 D+${Math.abs(days)}`
}

export const february2027 = Array.from({ length: 28 }, (_, index) => index + 1)
