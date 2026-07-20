import { useEffect, type ReactNode } from 'react'
import { concepts, type Concept } from './data/concepts'
import { resolveRoute } from './lib/routes'

const SAMPLE_NOTICE =
  '현재는 구조와 분위기를 비교하기 위한 예시입니다. 보내주실 레퍼런스를 받은 뒤 사진, 문구, 색감과 인터랙션을 새롭게 반영합니다.'

function App() {
  const route = resolveRoute(window.location.pathname)

  useEffect(() => {
    const pageTitle =
      route.kind === 'home'
        ? 'Wedding Invitation — Concept Lab'
        : route.kind === 'concept'
          ? `${route.concept.title} — Wedding Invitation`
          : '페이지를 찾을 수 없습니다 — Wedding Invitation'
    document.title = pageTitle
  }, [route])

  return (
    <>
      <a className="skip-link" href="#main-content">
        본문으로 바로가기
      </a>
      {route.kind === 'home' && <ConceptHub />}
      {route.kind === 'concept' && <ConceptPage concept={route.concept} />}
      {route.kind === 'not-found' && <NotFound />}
    </>
  )
}

function ConceptHub() {
  return (
    <main id="main-content" className="hub-page">
      <header className="hub-intro">
        <p className="hub-kicker">Wedding invitation · Concept lab</p>
        <p className="status-chip">Reference input pending</p>
        <h1>
          우리만의 청첩장을 위한
          <span>세 가지 시작점</span>
        </h1>
        <p className="hub-lede">
          지금은 최종안이 아닌 디자인 대기실입니다. 보내주실 시안을 함께 살펴본 뒤,
          마음에 드는 요소만 골라 세 방향을 다시 발전시킵니다.
        </p>
      </header>

      <nav className="concept-grid" aria-label="모바일 청첩장 시안 선택">
        {concepts.map((concept) => (
          <a
            className={`concept-card concept-card--${concept.code.toLowerCase()}`}
            href={`/${concept.slug}`}
            key={concept.slug}
          >
            <span className="concept-card__number">0{concept.code.charCodeAt(0) - 64}</span>
            <span className="concept-card__preview" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="concept-card__body">
              <small>Concept {concept.code}</small>
              <strong>{concept.title}</strong>
              <span>{concept.koreanTitle}</span>
              <em>{concept.summary}</em>
            </span>
            <span className="concept-card__arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </nav>

      <section className="hub-guide" aria-labelledby="guide-title">
        <p>How we will work</p>
        <h2 id="guide-title">레퍼런스가 도착하면</h2>
        <ol>
          <li><span>01</span>좋아하는 장면과 이유를 함께 찾습니다.</li>
          <li><span>02</span>세 시안에 우리만의 방식으로 다시 조합합니다.</li>
          <li><span>03</span>한 방향을 골라 실제 사진과 정보로 완성합니다.</li>
        </ol>
      </section>

      <footer className="hub-footer">
        <p>Preview only · 모든 이름, 날짜, 장소와 이미지는 가상 예시입니다.</p>
      </footer>
    </main>
  )
}

function ConceptPage({ concept }: { concept: Concept }) {
  const body: Record<Concept['slug'], ReactNode> = {
    'concept-a': <BlackCinema />,
    'concept-b': <PeachArchive />,
    'concept-c': <MinimalEditorial />,
  }

  return (
    <div className={`concept-page concept-page--${concept.code.toLowerCase()}`}>
      <ConceptNavigation current={concept} />
      <main id="main-content">{body[concept.slug]}</main>
    </div>
  )
}

function ConceptNavigation({ current }: { current: Concept }) {
  return (
    <nav className="concept-nav" aria-label="시안 이동">
      <a className="concept-nav__home" href="/" aria-label="시안 목록으로 돌아가기">
        <span aria-hidden="true">←</span> 목록
      </a>
      <p>
        Concept {current.code} <span>·</span> 3
      </p>
      <div className="concept-nav__switcher" role="group" aria-label="다른 시안">
        {concepts.map((concept) => (
          <a
            aria-current={concept.slug === current.slug ? 'page' : undefined}
            aria-label={`Concept ${concept.code}: ${concept.koreanTitle}`}
            href={`/${concept.slug}`}
            key={concept.slug}
          >
            {concept.code}
          </a>
        ))}
      </div>
    </nav>
  )
}

function PendingNote({ dark = false }: { dark?: boolean }) {
  return (
    <aside className={`pending-note${dark ? ' pending-note--dark' : ''}`}>
      <span aria-hidden="true">✦</span>
      <div>
        <strong>레퍼런스 반영 대기</strong>
        <p>{SAMPLE_NOTICE}</p>
      </div>
    </aside>
  )
}

function BlackCinema() {
  return (
    <article className="cinema">
      <header className="cinema-hero">
        <p className="cinema-label">A wedding film · Sample edition</p>
        <div
          className="cinema-frame"
          role="img"
          aria-label="신랑 신부 사진이 들어갈 세로형 프레임"
        >
          <div className="cinema-grain" aria-hidden="true" />
          <span>PHOTO<br />PLACEHOLDER</span>
        </div>
        <p className="cinema-date">MAY 22, 2027 · SAT 12:30</p>
        <h1>SEOYUN<br /><i>and</i> DOHYEON</h1>
        <p className="cinema-venue">RAON GARDEN CHAPEL · SEOUL</p>
      </header>

      <section className="cinema-chapter">
        <p>Chapter 01 · The invitation</p>
        <h2>오래 기억될<br />한 장면에 초대합니다.</h2>
        <p className="cinema-copy">
          서로의 하루를 가장 가까이에서 바라보던 두 사람이 이제 같은 방향으로 걸어가려
          합니다. 저희의 첫 장면을 함께 빛내 주세요.
        </p>
      </section>

      <section className="cinema-strip" aria-label="사진 갤러리 예시">
        {[1, 2, 3].map((item) => (
          <div key={item}>
            <span aria-hidden="true">0{item}</span>
            <p>PHOTO</p>
          </div>
        ))}
      </section>

      <section className="cinema-info">
        <div>
          <p>The day</p>
          <h2>2027.05.22</h2>
          <span>토요일 오후 12시 30분</span>
        </div>
        <div>
          <p>The place</p>
          <h2>Raon Garden</h2>
          <span>서울시 가상의 예식장 1층</span>
        </div>
        <button type="button" disabled aria-describedby="cinema-button-note">
          지도 영역 준비 중
        </button>
        <p id="cinema-button-note" className="visually-hidden">최종 제작 단계에서 지도가 연결됩니다.</p>
      </section>

      <PendingNote dark />
      <ConceptFooter label="Black Cinema · Draft 01" />
    </article>
  )
}

function PeachArchive() {
  return (
    <article className="archive">
      <header className="archive-cover">
        <p className="archive-eyebrow">Our little family archive</p>
        <div className="archive-title-row">
          <h1>서윤과 도현의<br /><i>오래된 새 이야기</i></h1>
          <span>Vol. 01</span>
        </div>
        <div
          className="archive-photo-stack"
          role="img"
          aria-label="가족사진과 커플사진이 들어갈 콜라주"
        >
          <div className="archive-photo archive-photo--old"><span>FAMILY PHOTO</span></div>
          <div className="archive-photo archive-photo--new"><span>OUR PHOTO</span></div>
          <p>같은 마음이 모여<br />한 가족이 되는 날</p>
        </div>
        <p className="archive-date">2027년 5월 22일 토요일 · 오후 12시 30분</p>
      </header>

      <section className="archive-letter">
        <p className="archive-section-label">A letter from us</p>
        <h2>소중한 분들께</h2>
        <p>
          두 집의 오래된 사진을 한 장씩 꺼내 보았습니다. 서로 다른 시간 속에서 자란 두
          사람이 만나, 이제 새로운 가족의 첫 페이지를 시작합니다.
        </p>
        <p className="archive-signature">서윤 · 도현 드림</p>
      </section>

      <section className="archive-memories" aria-labelledby="archive-memories-title">
        <p className="archive-section-label">Then & now</p>
        <h2 id="archive-memories-title">우리 가족의 시간</h2>
        <div className="archive-memory-grid">
          <div><span>1992</span><p>부모님의 결혼사진</p></div>
          <div><span>2027</span><p>우리의 결혼사진</p></div>
        </div>
        <p className="archive-caption">※ 실제 사진을 받은 뒤 우리 가족만의 이야기로 교체합니다.</p>
      </section>

      <section className="archive-ticket">
        <p>Wedding day</p>
        <strong>05 · 22</strong>
        <div><span>Saturday</span><span>12:30 PM</span></div>
        <hr />
        <p>Raon Garden Chapel · Sample venue</p>
      </section>

      <PendingNote />
      <ConceptFooter label="Peach Family Archive · Draft 01" />
    </article>
  )
}

function MinimalEditorial() {
  return (
    <article className="editorial">
      <header className="editorial-hero">
        <p className="editorial-overline">Wedding invitation · 2027</p>
        <div className="editorial-mark" aria-hidden="true"><span>S</span><i>+</i><span>D</span></div>
        <h1>서윤 <i>&</i> 도현</h1>
        <p className="editorial-script">we found home in each other</p>
        <div
          className="editorial-photo"
          role="img"
          aria-label="밝고 자연스러운 커플 사진이 들어갈 프레임"
        >
          <span>YOUR PHOTO<br />WILL BE HERE</span>
        </div>
        <p className="editorial-date">2027. 05. 22 · SAT · 12:30</p>
      </header>

      <section className="editorial-invite">
        <span aria-hidden="true">01</span>
        <p className="editorial-section-label">Invitation</p>
        <h2>함께라는 말이<br />가장 다정해진 날</h2>
        <p>
          평범한 날들을 특별하게 만들어 준 서로와 한평생을 약속하려 합니다. 귀한 걸음으로
          저희의 시작을 축복해 주세요.
        </p>
      </section>

      <section className="editorial-details">
        <span aria-hidden="true">02</span>
        <p className="editorial-section-label">When & where</p>
        <dl>
          <div><dt>Date</dt><dd>2027년 5월 22일 토요일</dd></div>
          <div><dt>Time</dt><dd>오후 12시 30분</dd></div>
          <div><dt>Place</dt><dd>라온 가든 채플</dd></div>
        </dl>
        <div className="editorial-line" aria-hidden="true"><i /><span>our day</span><i /></div>
      </section>

      <blockquote>
        “서두르지 않고, 오래 바라보고,
        <br />우리다운 하루를 만들겠습니다.”
      </blockquote>

      <PendingNote />
      <ConceptFooter label="Minimal Handwritten Editorial · Draft 01" />
    </article>
  )
}

function ConceptFooter({ label }: { label: string }) {
  return (
    <footer className="concept-footer">
      <p>{label}</p>
      <a href="/">세 시안 다시 보기 <span aria-hidden="true">↑</span></a>
    </footer>
  )
}

function NotFound() {
  return (
    <main id="main-content" className="not-found">
      <p>404 · Page not found</p>
      <h1>이 시안은 아직 준비되지 않았어요.</h1>
      <p>현재 확인할 수 있는 세 가지 모바일 청첩장 초안으로 돌아가 주세요.</p>
      <a href="/">시안 목록으로 돌아가기</a>
    </main>
  )
}

export default App
