import { useEffect, useRef, useState, type FormEvent, type SyntheticEvent } from 'react'
import { concepts, type Concept } from './data/concepts'
import { february2027, getDday, getTogetherDays, wedding } from './data/wedding'
import { createAsyncStartGuard } from './lib/async-start-guard'
import { readLargeTextPreference, writeLargeTextPreference } from './lib/preferences'
import { resolveRoute } from './lib/routes'

type Theme = 'letter' | 'cinema' | 'poster'

const themeBySlug: Record<Concept['slug'], Theme> = {
  'concept-a': 'letter',
  'concept-b': 'cinema',
  'concept-c': 'poster',
}

const heroByTheme: Record<Theme, string> = {
  letter: '/images/wedding/01128.webp',
  cinema: '/images/wedding/01813.webp',
  poster: '/images/wedding/01782.webp',
}

const themeCopy = {
  letter: { eyebrow: 'A letter for our favorite people', chapter: '첫빛의 편지', edition: 'Romantic paper edition' },
  cinema: { eyebrow: 'A film by Taehwan & Hyojin', chapter: 'Midnight Cinema', edition: 'Chapter 01 · The beginning' },
  poster: { eyebrow: 'Anyang · Platform for two', chapter: 'One way, together', edition: 'Poster No. 0220' },
} as const

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function trapDialogFocus(event: KeyboardEvent, container: HTMLElement | null) {
  if (event.key !== 'Tab' || !container) return
  const focusable = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
    .filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true')
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement
  if (event.shiftKey && (active === first || !container.contains(active))) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && (active === last || !container.contains(active))) {
    event.preventDefault()
    first.focus()
  }
}

function preventImageDownload(event: SyntheticEvent) {
  event.preventDefault()
}

const proceduralNotes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23]
const proceduralStepSeconds = 0.8

function scheduleProceduralMusic(context: AudioContext, output: GainNode) {
  const start = context.currentTime + 0.06
  proceduralNotes.forEach((frequency, index) => {
    const noteStart = start + index * proceduralStepSeconds
    const oscillator = context.createOscillator()
    const envelope = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    envelope.gain.setValueAtTime(0.0001, noteStart)
    envelope.gain.exponentialRampToValueAtTime(0.7, noteStart + 0.08)
    envelope.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.72)
    oscillator.connect(envelope).connect(output)
    oscillator.start(noteStart)
    oscillator.stop(noteStart + 0.74)
  })
}

function useWeddingMusic() {
  const [playing, setPlaying] = useState(false)
  const [starting, setStarting] = useState(false)
  const [status, setStatus] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const contextRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<number | null>(null)
  const disposedRef = useRef(false)
  const startGuardRef = useRef(createAsyncStartGuard())

  const stop = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current)
    timerRef.current = null
    audioRef.current?.pause()
    audioRef.current = null
    void contextRef.current?.close()
    contextRef.current = null
    setPlaying(false)
    setStatus('배경음악을 일시정지했습니다.')
  }

  const startProcedural = async () => {
    const context = new AudioContext()
    contextRef.current = context
    try {
      const output = context.createGain()
      output.gain.value = 0.035
      output.connect(context.destination)
      await context.resume()
      if (disposedRef.current) {
        void context.close()
        if (contextRef.current === context) contextRef.current = null
        return
      }
      scheduleProceduralMusic(context, output)
      const cycleMs = proceduralNotes.length * proceduralStepSeconds * 1000
      timerRef.current = window.setInterval(() => scheduleProceduralMusic(context, output), cycleMs)
      setPlaying(true)
      setStatus('잔잔한 배경음악을 재생합니다.')
    } catch (error) {
      void context.close()
      if (contextRef.current === context) contextRef.current = null
      throw error
    }
  }

  const toggle = async () => {
    if (playing) {
      stop()
      return
    }

    try {
      await startGuardRef.current.run(async () => {
        if (disposedRef.current) return
        setStarting(true)
        setStatus('배경음악을 준비합니다.')
        try {
          const localSource = import.meta.env.VITE_WEDDING_MUSIC_SRC?.trim()
          if (localSource) {
            const audio = new Audio(localSource)
            audio.loop = true
            audio.preload = 'auto'
            audioRef.current = audio
            try {
              await audio.play()
              if (disposedRef.current) {
                audio.pause()
                if (audioRef.current === audio) audioRef.current = null
                return
              }
              setPlaying(true)
              setStatus('배경음악을 재생합니다.')
              return
            } catch {
              audio.pause()
              if (audioRef.current === audio) audioRef.current = null
              if (disposedRef.current) return
            }
          }

          await startProcedural()
        } finally {
          if (!disposedRef.current) setStarting(false)
        }
      })
    } catch {
      if (!disposedRef.current) {
        setPlaying(false)
        setStatus('이 브라우저에서는 음악을 재생할 수 없습니다.')
      }
    }
  }

  useEffect(() => () => {
    disposedRef.current = true
    if (timerRef.current !== null) window.clearInterval(timerRef.current)
    timerRef.current = null
    audioRef.current?.pause()
    audioRef.current = null
    void contextRef.current?.close()
    contextRef.current = null
  }, [])

  return { playing, starting, status, toggle }
}

function App() {
  const route = resolveRoute(window.location.pathname)

  useEffect(() => {
    document.title = route.kind === 'concept'
      ? `${wedding.groom.name} · ${wedding.bride.name} — ${route.concept.title}`
      : route.kind === 'home'
        ? `${wedding.groom.name} ♡ ${wedding.bride.name} 모바일 청첩장`
        : '페이지를 찾을 수 없습니다'

    const themeColor = route.kind === 'concept'
      ? { letter: '#faefec', cinema: '#171513', poster: '#064ec5' }[themeBySlug[route.concept.slug]]
      : '#faefec'
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', themeColor)
  }, [route])

  return (
    <>
      <a className="skip-link" href="#main-content">본문으로 바로가기</a>
      {route.kind === 'home' && <ConceptHub />}
      {route.kind === 'concept' && <Invitation concept={route.concept} />}
      {route.kind === 'not-found' && <NotFound />}
    </>
  )
}

function ConceptHub() {
  return (
    <main id="main-content" className="hub-page">
      <header className="hub-intro">
        <p className="hub-kicker">TAEHWAN & HYOJIN · WEDDING INVITATION</p>
        <p className="status-chip">세 가지 모바일 시안</p>
        <h1>우리의 하루를 담은<br /><span>서로 다른 세 개의 장면</span></h1>
        <p className="hub-lede">
          같은 사진과 같은 이야기를 세 가지 분위기로 구성했습니다. 마음에 드는 시안을 골라
          색감과 문구, 세부 기능을 함께 다듬어 주세요.
        </p>
      </header>

      <nav className="concept-grid" aria-label="모바일 청첩장 시안 선택">
        {concepts.map((concept) => {
          const theme = themeBySlug[concept.slug]
          return (
            <a className={`concept-card concept-card--${theme}`} href={`/${concept.slug}`} key={concept.slug}>
              <img src={heroByTheme[theme]} alt="" />
              <span className="concept-card__veil" />
              <span className="concept-card__number">0{concept.code.charCodeAt(0) - 64}</span>
              <span className="concept-card__body">
                <small>Concept {concept.code}</small>
                <strong>{concept.title}</strong>
                <span>{concept.koreanTitle}</span>
                <em>{concept.summary}</em>
              </span>
              <span className="concept-card__arrow" aria-hidden="true">↗</span>
            </a>
          )
        })}
      </nav>

      <section className="hub-guide" aria-labelledby="guide-title">
        <p>Confirmed details</p>
        <div>
          <h2 id="guide-title">황태환 그리고 하효진</h2>
          <p>2027년 2월 20일 토요일 오후 2시 · 안양역 인근</p>
          <small>예식장명과 상세 주소 등 미정 정보는 모든 시안에 ‘입력 예정’으로 표시했습니다.</small>
        </div>
      </section>
      <footer className="hub-footer">Original photographs · Three original directions · Mobile first</footer>
    </main>
  )
}

function Invitation({ concept }: { concept: Concept }) {
  const theme = themeBySlug[concept.slug]
  const isLetter = theme === 'letter'
  const copy = themeCopy[theme]
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [galleryExpanded, setGalleryExpanded] = useState(false)
  const [rsvpOpen, setRsvpOpen] = useState(false)
  const [tab, setTab] = useState<'transit' | 'parking' | 'gift'>('transit')
  const [copyStatus, setCopyStatus] = useState('')
  const [rsvpStatus, setRsvpStatus] = useState('')
  const [largeText, setLargeText] = useState(readLargeTextPreference)
  const music = useWeddingMusic()
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const toggleLargeText = () => {
    setLargeText((current) => {
      const next = !current
      writeLargeTextPreference(next)
      return next
    })
  }

  const openLightbox = (index: number) => {
    returnFocusRef.current = document.activeElement as HTMLElement
    setLightboxIndex(index)
  }
  const closeOverlay = () => {
    setLightboxIndex(null)
    setRsvpOpen(false)
    window.setTimeout(() => returnFocusRef.current?.focus(), 0)
  }
  const openRsvp = () => {
    returnFocusRef.current = document.activeElement as HTMLElement
    setRsvpStatus('')
    setRsvpOpen(true)
  }
  const copyLink = async () => {
    let copied = false
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href)
        copied = true
      }
    } catch { /* Use the legacy fallback below. */ }

    if (!copied) {
      const textarea = document.createElement('textarea')
      textarea.value = window.location.href
      textarea.readOnly = true
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      textarea.style.pointerEvents = 'none'
      document.body.appendChild(textarea)
      try {
        textarea.select()
        textarea.setSelectionRange(0, textarea.value.length)
        copied = document.execCommand('copy')
      } catch { /* Show the manual-copy guidance below. */ }
      finally { textarea.remove() }
    }

    setCopyStatus(copied ? '링크를 복사했습니다.' : '주소창의 링크를 직접 복사해 주세요.')
  }
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${wedding.groom.name} ♡ ${wedding.bride.name}, 결혼합니다`, url: window.location.href })
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          setCopyStatus('공유를 취소했습니다.')
          return
        }
        await copyLink()
      }
    } else {
      await copyLink()
    }
  }

  return (
    <div className={`concept-page theme-${theme}${largeText ? ' large-text' : ''}`}>
      <ConceptNavigation
        current={concept}
        musicPlaying={music.playing}
        musicStarting={music.starting}
        musicStatus={music.status}
        toggleMusic={music.toggle}
        largeText={largeText}
        toggleLargeText={toggleLargeText}
      />
      <main id="main-content" className="invitation">
        <header className="hero">
          {isLetter
            ? <p className="hero-occasion">{wedding.ceremony.shortDate}<span aria-hidden="true">·</span>결혼합니다</p>
            : <div className="hero-topline"><span>{copy.eyebrow}</span><span>2027</span></div>}
          <div className="hero-photo-wrap">
            <img className="hero-photo" src={heroByTheme[theme]} alt="웨딩 촬영 중 서로를 바라보는 황태환과 하효진" />
            <span className="hero-photo-mark" aria-hidden="true">T · H</span>
          </div>
          <div className="hero-copy">
            {!isLetter && <p>{copy.edition}</p>}
            <h1><span>{wedding.groom.name}</span><i>&</i><span>{wedding.bride.name}</span></h1>
            <p className="hero-date">{isLetter ? `${wedding.ceremony.shortDate} · 토요일 · 오후 2시` : `${wedding.ceremony.shortDate} · SAT · 14:00`}</p>
            <p className="hero-place">{wedding.ceremony.location}</p>
          </div>
          <a className="scroll-cue" href="#invitation-message">초대의 글 <span aria-hidden="true">↓</span></a>
        </header>

        <section id="invitation-message" className="section invitation-message">
          <SectionHead number="01" eyebrow="Invitation" title="소중한 분들을 초대합니다" simple={isLetter} />
          <p className="script-line">{copy.chapter}</p>
          <div className="invitation-lines">{wedding.invitation.map((line) => <p key={line}>{line}</p>)}</div>
          <p className="couple-sign"><strong>{wedding.groom.name}</strong><span>그리고</span><strong>{wedding.bride.name}</strong></p>
        </section>

        <section className="section couple-section">
          {!isLetter && <SectionHead number="02" eyebrow="Bride & Groom" title="저희를 소개합니다" />}
          <div className="couple-cards">
            <article>
              <span>{isLetter ? wedding.groom.role : 'GROOM'}</span><strong>{wedding.groom.name}</strong><p>부모님 성함 · 생일 · 소개 문구<br /><em>입력 예정</em></p>
            </article>
            <article>
              <span>{isLetter ? wedding.bride.role : 'BRIDE'}</span><strong>{wedding.bride.name}</strong><p>부모님 성함 · 생일 · 소개 문구<br /><em>입력 예정</em></p>
            </article>
          </div>
        </section>

        <section className="section day-section">
          <SectionHead number="03" eyebrow="The day" title={isLetter ? '예식 안내' : '우리의 결혼식'} simple={isLetter} />
          <div className="date-lockup"><strong>02</strong><i>/</i><strong>20</strong><span>{isLetter ? <>토요일<br />오후 2시</> : <>Saturday<br />2:00 PM</>}</span></div>
          <Calendar />
          <p className="dday">{getDday()}</p>
        </section>

        <section className="section gallery-section">
          <SectionHead number="04" eyebrow="Our moments" title={isLetter ? '갤러리' : '기억하고 싶은 장면들'} simple={isLetter} />
          <div className="gallery-grid" onContextMenu={preventImageDownload} onDragStart={preventImageDownload}>
            {wedding.gallery.slice(0, galleryExpanded ? 12 : 9).map((photo, index) => (
              <button type="button" onClick={() => openLightbox(index)} key={photo.src} aria-label={`${photo.alt} 크게 보기`}>
                <img src={photo.src} alt={photo.alt} loading={index > 2 ? 'lazy' : undefined} draggable={false} />
              </button>
            ))}
          </div>
          {!galleryExpanded && <button className="outline-button" type="button" onClick={() => setGalleryExpanded(true)}>사진 더보기 <span>+3</span></button>}
        </section>

        <section className="section venue-section">
          <SectionHead number="05" eyebrow="Location" title="오시는 길" simple={isLetter} />
          <div className="venue-card">
            <span className="venue-pin" aria-hidden="true">●</span>
            <p>{wedding.ceremony.location}</p>
            <h3>{wedding.ceremony.venue}</h3>
            <address>{wedding.ceremony.address}</address>
          </div>
          <div className="map-placeholder" aria-label="상세 주소 입력 후 연결할 지도 영역">
            <span>ANYANG</span><i aria-hidden="true" /><p>정확한 예식장 주소를 입력하면<br />지도가 이곳에 연결됩니다.</p>
          </div>
          <div className="map-buttons" aria-label="길찾기 서비스">
            {['네이버 지도', '카카오맵', '티맵'].map((label) => <button type="button" disabled key={label}>{label}<small>주소 입력 예정</small></button>)}
          </div>
          <InfoTabs tab={tab} setTab={setTab} />
        </section>

        <section className="section rsvp-section">
          <SectionHead number="06" eyebrow="RSVP" title={isLetter ? '참석 여부 전달' : '참석 여부를 알려주세요'} simple={isLetter} />
          <p>더 나은 예식 준비를 위한 예시 기능입니다. 지금 입력한 정보는 저장되거나 전송되지 않습니다.</p>
          <button className="primary-button" type="button" onClick={openRsvp}>참석 여부 전달하기 <span aria-hidden="true">→</span></button>
        </section>

        <section className="section message-section">
          <SectionHead number="07" eyebrow="With love" title="마음을 전하실 곳" simple={isLetter} />
          <details><summary>신랑 측 연락처 및 계좌 <span>+</span></summary><p>연락처와 계좌 정보 입력 예정입니다. 샘플 화면에는 개인정보를 표시하지 않습니다.</p></details>
          <details><summary>신부 측 연락처 및 계좌 <span>+</span></summary><p>연락처와 계좌 정보 입력 예정입니다. 샘플 화면에는 개인정보를 표시하지 않습니다.</p></details>
          <details><summary>{isLetter ? '축하화환 보내기' : '축하 화환 및 메시지'} <span>+</span></summary><p>신청 방식과 전달 문구를 결정한 뒤 연결할 예정입니다.</p></details>
        </section>

        <section className="section together-section">
          <SectionHead number="08" eyebrow="Since 2019" title="함께한 시간" simple={isLetter} />
          <p className="together-date">{wedding.relationship.metDateLabel}, 처음 만난 날</p>
          <p className="together-count">{getTogetherDays()}</p>
        </section>

        <section className="section snap-section">
          {!isLetter && <div className="snap-badge">COMING ON THE WEDDING DAY</div>}
          <h2>{isLetter ? 'GUEST SNAP' : 'Guest Snap'}</h2>
          <p>하객 여러분이 담아주신 순간을 한곳에 모으는 기능을 준비하고 있습니다.</p>
          <button type="button" disabled>사진 올리기 · 준비 중</button>
        </section>

        <section className="section share-section">
          {!isLetter && <p>Share our day</p>}<h2>소중한 분께<br />초대장을 전해주세요.</h2>
          <div><button type="button" onClick={share}>공유하기</button><button type="button" onClick={copyLink}>링크 복사</button></div>
          <button type="button" className="kakao-pending" disabled>카카오 초대장 공유 · Developers 키 연결 예정</button>
          <p className="copy-status" role="status">{copyStatus}</p>
        </section>

        <footer className="invitation-footer"><p>TAEHWAN & HYOJIN</p><span>2027. 02. 20 · ANYANG</span><a href="#main-content">맨 위로 ↑</a></footer>
      </main>

      {lightboxIndex !== null && <Lightbox index={lightboxIndex} setIndex={setLightboxIndex} close={closeOverlay} />}
      {rsvpOpen && <RsvpDialog close={closeOverlay} status={rsvpStatus} setStatus={setRsvpStatus} />}
    </div>
  )
}

function SectionHead({ number, eyebrow, title, simple = false }: { number: string; eyebrow: string; title: string; simple?: boolean }) {
  if (simple) return <header className="section-head section-head--simple"><h2>{title}</h2></header>
  return <header className="section-head"><span>{number}</span><div><p>{eyebrow}</p><h2>{title}</h2></div></header>
}

function Calendar() {
  return (
    <div className="calendar" aria-label="2027년 2월 달력">
      <div className="calendar-title"><span>February</span><strong>2027</strong></div>
      <div className="calendar-grid weekdays">{['일','월','화','수','목','금','토'].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="calendar-grid days"><span />{february2027.map((day) => <span className={day === 20 ? 'wedding-day' : ''} key={day} aria-label={day === 20 ? '20일 결혼식' : `${day}일`}>{day}</span>)}</div>
    </div>
  )
}

function InfoTabs({ tab, setTab }: { tab: 'transit' | 'parking' | 'gift'; setTab: (tab: 'transit' | 'parking' | 'gift') => void }) {
  const content = {
    transit: ['대중교통', '지하철 출구 및 버스 노선 입력 예정'],
    parking: ['주차 안내', '주차장 위치와 이용 시간 입력 예정'],
    gift: ['답례품 안내', '수령 위치와 운영 시간 입력 예정'],
  } as const
  return <div className="info-tabs"><div role="tablist" aria-label="교통 및 이용 안내">{(['transit','parking','gift'] as const).map((key) => <button role="tab" aria-selected={tab === key} type="button" onClick={() => setTab(key)} key={key}>{content[key][0]}</button>)}</div><div role="tabpanel" tabIndex={0}><strong>{content[tab][0]}</strong><p>{content[tab][1]}</p></div></div>
}

function Lightbox({ index, setIndex, close }: { index: number; setIndex: (index: number) => void; close: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const count = wedding.gallery.length
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') setIndex((index - 1 + count) % count)
      if (event.key === 'ArrowRight') setIndex((index + 1) % count)
      trapDialogFocus(event, dialogRef.current)
    }
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', onKey)
    return () => { document.body.classList.remove('modal-open'); window.removeEventListener('keydown', onKey) }
  }, [close, count, index, setIndex])
  const photo = wedding.gallery[index]
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && close()}><div ref={dialogRef} className="lightbox" role="dialog" aria-modal="true" aria-label={`웨딩 사진 ${index + 1} / ${count}`}><button ref={closeRef} className="dialog-close" type="button" onClick={close} aria-label="사진 닫기">×</button><img src={photo.src} alt={photo.alt} draggable={false} onContextMenu={preventImageDownload} onDragStart={preventImageDownload} /><p>{String(index + 1).padStart(2,'0')} / {count}</p><div><button type="button" onClick={() => setIndex((index - 1 + count) % count)} aria-label="이전 사진">← 이전</button><button type="button" onClick={() => setIndex((index + 1) % count)} aria-label="다음 사진">다음 →</button></div></div></div>
}

function RsvpDialog({ close, status, setStatus }: { close: () => void; status: string; setStatus: (status: string) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      trapDialogFocus(event, dialogRef.current)
    }
    document.body.classList.add('modal-open'); window.addEventListener('keydown', onKey)
    return () => { document.body.classList.remove('modal-open'); window.removeEventListener('keydown', onKey) }
  }, [close])
  const submit = (event: FormEvent) => { event.preventDefault(); setStatus('샘플 확인을 완료했습니다. 입력 내용은 저장하거나 전송하지 않았습니다.') }
  return <div className="dialog-backdrop" role="presentation"><section ref={dialogRef} className="rsvp-dialog" role="dialog" aria-modal="true" aria-labelledby="rsvp-title"><button ref={closeRef} className="dialog-close" type="button" onClick={close} aria-label="참석 여부 창 닫기">×</button><p>RSVP · SAMPLE</p><h2 id="rsvp-title">참석 여부 전달하기</h2><div className="privacy-note">현재는 화면 확인용 샘플입니다. 어떠한 정보도 저장·전송하지 않습니다.</div><form onSubmit={submit}><fieldset><legend>참석 여부</legend><label><input type="radio" name="attendance" value="attending" defaultChecked /> 참석합니다</label><label><input type="radio" name="attendance" value="celebrating" /> 마음으로 축하합니다</label></fieldset><label>성함<input type="text" placeholder="샘플 입력" required maxLength={30} autoComplete="name" /></label><label>구분<select defaultValue="" required><option value="" disabled>선택해 주세요</option><option>신랑 측</option><option>신부 측</option></select></label><button className="primary-button" type="submit">샘플 확인하기</button><p role="status">{status}</p></form></section></div>
}

function ConceptNavigation({
  current,
  musicPlaying,
  musicStarting,
  musicStatus,
  toggleMusic,
  largeText,
  toggleLargeText,
}: {
  current: Concept
  musicPlaying: boolean
  musicStarting: boolean
  musicStatus: string
  toggleMusic: () => Promise<void>
  largeText: boolean
  toggleLargeText: () => void
}) {
  return <nav className="concept-nav" aria-label="시안 및 보기 설정"><a href="/" aria-label="시안 목록으로 돌아가기">← <span>목록</span></a><div className="concept-nav__routes">{concepts.map((concept) => <a aria-current={concept.slug === current.slug ? 'page' : undefined} aria-label={`Concept ${concept.code}`} href={`/${concept.slug}`} key={concept.slug}>{concept.code}</a>)}</div><div className="concept-nav__tools"><button type="button" disabled={musicStarting} aria-pressed={musicPlaying} aria-label={musicStarting ? '배경음악 준비 중' : musicPlaying ? '배경음악 일시정지' : '배경음악 재생'} title={musicStarting ? '음악 준비 중' : musicPlaying ? '음악 일시정지' : '음악 재생'} onClick={() => void toggleMusic()}><span aria-hidden="true">{musicStarting ? '…' : musicPlaying ? 'Ⅱ' : '♪'}</span><small>음악</small></button><button type="button" aria-pressed={largeText} aria-label={largeText ? '기본 글씨로 보기' : '큰 글씨로 보기'} title={largeText ? '기본 글씨' : '큰 글씨'} onClick={toggleLargeText}><span aria-hidden="true">가+</span><small>큰글</small></button><span className="sr-only" role="status" aria-live="polite">{musicStatus}</span></div></nav>
}

function NotFound() {
  return <main id="main-content" className="not-found"><p>404</p><h1>페이지를 찾을 수 없습니다.</h1><a href="/">세 가지 시안으로 돌아가기</a></main>
}

export default App
