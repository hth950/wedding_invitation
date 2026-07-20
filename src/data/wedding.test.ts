import { describe, expect, it } from 'vitest'
import {
  february2027,
  getDday,
  getTogetherDays,
  MET_DATE_ISO,
  MET_DATE_LABEL,
  wedding,
  WEDDING_DATE_ISO,
} from './wedding'

describe('wedding content', () => {
  it('uses the confirmed couple, date, and safe venue placeholder', () => {
    expect(wedding.groom.name).toBe('황태환')
    expect(wedding.bride.name).toBe('하효진')
    expect(WEDDING_DATE_ISO).toBe('2027-02-20T14:00:00+09:00')
    expect(wedding.ceremony.venue).toContain('입력 예정')
  })

  it('provides twelve distinct optimized gallery images', () => {
    expect(wedding.gallery).toHaveLength(12)
    expect(new Set(wedding.gallery.map(({ src }) => src)).size).toBe(12)
    expect(wedding.gallery.every(({ src }) => src.endsWith('.webp'))).toBe(true)
  })

  it('calculates D-day and covers every date in February 2027', () => {
    expect(getDday(new Date('2027-02-19T10:00:00+09:00'))).toBe('결혼식까지 D-1')
    expect(getDday(new Date('2027-02-20T10:00:00+09:00'))).toBe('오늘, 저희 결혼합니다')
    expect(february2027.at(-1)).toBe(28)
  })

  it('counts the confirmed first day together as D+1', () => {
    expect(MET_DATE_ISO).toBe('2019-07-09')
    expect(MET_DATE_LABEL).toBe('2019년 7월 9일')
    expect(wedding.relationship.metDate).toBe(MET_DATE_ISO)
    expect(getTogetherDays(new Date('2019-07-09T12:00:00+09:00'))).toBe('함께한 지 D+1')
    expect(getTogetherDays(new Date('2026-07-20T12:00:00+09:00'))).toBe('함께한 지 D+2569')
  })

  it('changes counters at midnight in Korea regardless of the viewer timezone', () => {
    expect(getTogetherDays(new Date('2026-07-19T14:59:59Z'))).toBe('함께한 지 D+2568')
    expect(getTogetherDays(new Date('2026-07-19T15:00:00Z'))).toBe('함께한 지 D+2569')
    expect(getDday(new Date('2027-02-19T14:59:59Z'))).toBe('결혼식까지 D-1')
    expect(getDday(new Date('2027-02-19T15:00:00Z'))).toBe('오늘, 저희 결혼합니다')
    expect(getDday(new Date('2027-02-20T15:00:00Z'))).toBe('결혼한 지 D+1')
  })
})
