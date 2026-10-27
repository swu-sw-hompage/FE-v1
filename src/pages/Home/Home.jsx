import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import heroTeam from '../../assets/images/brand/hero-slide-team.jpg'
import heroLab from '../../assets/images/brand/hero-slide-lab.jpg'
import heroLecture from '../../assets/images/brand/hero-slide-lecture.jpg'
import iconQuick1 from '../../assets/images/brand/icon-quick1.svg'
import iconQuick2 from '../../assets/images/brand/icon-quick2.svg'
import iconQuick3 from '../../assets/images/brand/icon-quick3.svg'
import { getNotices, noticeCategoryLabel, formatNoticeDate } from '../../api/notice'
import { getGraduationProjects } from '../../api/graduation'
import { getHeroSlides, heroImageUrl } from '../../api/hero'
import { ACTIVITY_LATEST_YEAR } from '../../constants/activities'
import './Home.css'

const QUICK_LINKS = [
  { id: 'roadmap', icon: iconQuick3, title: '전공 로드맵', to: '/curriculum/roadmap' },
  { id: 'requirements', icon: iconQuick2, title: '졸업 요건', to: '/curriculum/requirements' },
  { id: 'notice-sub', icon: iconQuick1, title: '공지 알림 신청', mobileTitle: '공지 알림', to: '/notice/subscribe' },
]

// 홈 미리보기에 보여줄 공지 개수
const HOME_NOTICE_COUNT = 5
// 백엔드는 필독(pinned) 글을 맨 앞에 붙여서 내려주기 때문에, 필독이 많으면 첫 페이지 5개가
// 전부 필독으로 채워진다. 넉넉하게 받아와서 날짜순으로 다시 정렬한 뒤 앞에서 잘라 쓴다.
const HOME_NOTICE_FETCH_SIZE = 50

const noticeTime = (notice) => {
  const t = Date.parse(notice.publishedAt ?? notice.createdAt ?? '')
  return Number.isNaN(t) ? 0 : t
}

// 필독 여부와 상관없이 최신 글이 위로 오도록 정렬 (같은 시각이면 id 큰 글이 위)
const sortByLatest = (list) =>
  [...list].sort((a, b) => noticeTime(b) - noticeTime(a) || (b.id ?? 0) - (a.id ?? 0))

// 메인 hero 배경 슬라이드. 사진·순서는 관리자 > 메인 사진에서 관리하고, API를 못 받으면 아래 기본 3장을 쓴다.
const DEFAULT_HERO_SLIDES = [
  { id: 'team', src: heroTeam, label: '회의실에서 코드를 함께 보며 팀 프로젝트를 하는 학생들' },
  { id: 'lab', src: heroLab, label: '학과 컴퓨터 실습실' },
  { id: 'lecture', src: heroLecture, label: '강의실에서 진행되는 소프트웨어 전공 수업' },
]
const HERO_INTERVAL_MS = 5000
// 마지막으로 받은 사진 목록을 기억해 두고 다음 방문 때 바로 보여준다 (기본 사진이 잠깐 보였다 바뀌는 깜빡임 방지)
const HERO_CACHE_KEY = 'swu_hero_slides'

const readCachedSlides = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(HERO_CACHE_KEY))
    return Array.isArray(cached) && cached.length > 0 ? cached : null
  } catch {
    return null
  }
}

function useHeroSlidesData() {
  const [slides, setSlides] = useState(() => readCachedSlides() ?? DEFAULT_HERO_SLIDES)

  useEffect(() => {
    getHeroSlides()
      .then((result) => {
        if (!Array.isArray(result) || result.length === 0) return
        const next = result.map((s) => ({ id: s.id, src: heroImageUrl(s.imageUrl), label: s.altText }))
        setSlides(next)
        try {
          localStorage.setItem(HERO_CACHE_KEY, JSON.stringify(next))
        } catch {
          // 저장 못 해도 이번 화면에는 이미 반영됐다.
        }
      })
      .catch(() => {})
  }, [])

  return slides
}

// 일정 간격으로 다음 슬라이드로 넘김. paused면 멈추고, 사용자가 동작 줄이기를 켰으면 자동 전환 안 함
function useHeroSlide(count, paused) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (paused || count < 2) return undefined
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), HERO_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [count, paused, index])

  return [index, setIndex]
}

function HeroSlides({ slides, className, index }) {
  return slides.map((slide, i) => (
    <img
      key={slide.id}
      className={`${className}${i === index ? ' is-active' : ''}`}
      src={slide.src}
      alt=""
      aria-hidden={i !== index}
      loading={i === 0 ? 'eager' : 'lazy'}
      fetchPriority={i === 0 ? 'high' : undefined}
    />
  ))
}

function HeroDots({ slides, className, index, onSelect }) {
  if (slides.length < 2) return null
  return (
    <div className={`home__hero-dots ${className ?? ''}`}>
      {slides.map((slide, i) => (
        <button
          key={slide.id}
          type="button"
          className={`home__hero-dot${i === index ? ' is-active' : ''}`}
          aria-label={`${i + 1}번째 사진: ${slide.label}`}
          aria-current={i === index ? 'true' : undefined}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  )
}

// 모바일 hero 좌우 스와이프. 세로 스크롤은 그대로 두고, 가로로 충분히 민 경우에만 넘김
const SWIPE_THRESHOLD_PX = 40

function useHeroSwipe(setIndex, count, setPaused) {
  const start = useRef(null)

  const onTouchStart = (e) => {
    const t = e.touches[0]
    start.current = { x: t.clientX, y: t.clientY }
    setPaused(true)
  }

  const onTouchEnd = (e) => {
    setPaused(false)
    if (!start.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.current.x
    const dy = t.clientY - start.current.y
    start.current = null
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) return
    // 왼쪽으로 밀면 다음 사진, 오른쪽으로 밀면 이전 사진
    setIndex((i) => (dx < 0 ? (i + 1) % count : (i - 1 + count) % count))
  }

  const onTouchCancel = () => {
    start.current = null
    setPaused(false)
  }

  return { onTouchStart, onTouchEnd, onTouchCancel }
}

const NOTICE_FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'academic', label: '학사' },
  { key: 'employment', label: '취업' },
]

export default function Home() {
  const [notices, setNotices] = useState([])
  const [projects, setProjects] = useState([])
  const [noticeFilter, setNoticeFilter] = useState('all')
  const [heroPaused, setHeroPaused] = useState(false)
  const heroSlides = useHeroSlidesData()
  const [heroIndex, setHeroIndex] = useHeroSlide(heroSlides.length, heroPaused)
  const heroSwipe = useHeroSwipe(setHeroIndex, heroSlides.length, setHeroPaused)
  // 사진 수가 줄어 현재 순번이 범위를 벗어나면 첫 사진부터
  const heroActive = heroIndex < heroSlides.length ? heroIndex : 0

  useEffect(() => {
    getNotices({
      academic: noticeFilter === 'academic' ? true : undefined,
      employment: noticeFilter === 'employment' ? true : undefined,
      page: 0,
      size: HOME_NOTICE_FETCH_SIZE,
    })
      .then((result) => setNotices(sortByLatest(result?.content ?? []).slice(0, HOME_NOTICE_COUNT)))
      .catch(() => setNotices([]))
  }, [noticeFilter])

  useEffect(() => {
    getGraduationProjects({ year: ACTIVITY_LATEST_YEAR, page: 0, size: 4 })
      .then((result) => setProjects(result?.content ?? []))
      .catch(() => setProjects([]))
  }, [])

  return (
    <div className="home">
      <section className="home__hero-mobile" {...heroSwipe}>
        <HeroSlides slides={heroSlides} className="home__hero-mobile-bg" index={heroActive} />
        <div className="home__hero-mobile-gradient" />
        <HeroDots
          slides={heroSlides}
          className="home__hero-dots--mobile"
          index={heroActive}
          onSelect={setHeroIndex}
        />
        <div className="home__hero-mobile-text">
          <span>기술로 문제를 정의하고,</span>
          <span>세상을 바꾸는 인재를 키웁니다</span>
        </div>
      </section>

      <div className="home__mobile-cta">
        <Link to="/about" className="home__mobile-btn home__mobile-btn--primary">
          학과 알아보기
        </Link>
        <Link to="/curriculum" className="home__mobile-btn">
          교육과정 보기
        </Link>
      </div>

      <div className="home__mobile-quicklinks">
        {QUICK_LINKS.map((link) => (
          <Link to={link.to} key={link.id} className="home__mobile-quick-card">
            <span className="home__mobile-quick-icon">
              <img src={link.icon} alt="" />
            </span>
            <strong>{link.mobileTitle ?? link.title}</strong>
          </Link>
        ))}
      </div>

      <div className="home__mobile-section">
        <div className="home__mobile-section-head">
          <h2>공지사항</h2>
          <Link to="/notice">전체보기</Link>
        </div>
        <div className="home__mobile-notice-tabs">
          {NOTICE_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={
                noticeFilter === f.key
                  ? 'home__mobile-notice-tab home__mobile-notice-tab--active'
                  : 'home__mobile-notice-tab'
              }
              onClick={() => setNoticeFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <ul className="home__mobile-notice-list">
          {notices.slice(0, 4).map((notice) => (
            <li key={notice.id}>
              <span
                className={
                  noticeCategoryLabel(notice) === '취업'
                    ? 'home__mobile-notice-category home__mobile-notice-category--employment'
                    : 'home__mobile-notice-category'
                }
              >
                {noticeCategoryLabel(notice)}
              </span>
              <Link to={`/notice/${notice.id}`}>{notice.title}</Link>
              <span className="home__mobile-notice-date">
                {formatNoticeDate(notice.publishedAt ?? notice.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="home__mobile-section">
        <div className="home__mobile-section-head">
          <h2>학생활동</h2>
          <Link to={`/activities/${ACTIVITY_LATEST_YEAR}`}>전체보기</Link>
        </div>
        <div className="home__mobile-scroller">
          {projects.map((project) => (
            <Link to={`/activities/${ACTIVITY_LATEST_YEAR}/${project.id}`} className="home__mobile-scroll-card" key={project.id}>
              {project.thumbnailUrl ? (
                <img className="home__mobile-scroll-image" src={project.thumbnailUrl} alt="" />
              ) : (
                <div className="home__mobile-scroll-image home__mobile-scroll-image--empty" />
              )}
              <strong>{project.title}</strong>
            </Link>
          ))}
        </div>
      </div>

      <section
        className="home__hero"
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
      >
        <div className="home__hero-media">
          <HeroSlides slides={heroSlides} className="home__hero-bg" index={heroActive} />
          <HeroDots slides={heroSlides} index={heroActive} onSelect={setHeroIndex} />
        </div>
        <div className="home__hero-fade" />
        <div className="container home__hero-inner">
          <div className="home__hero-text">
            <h1>
              <span>기술로 문제를 정의하고,</span>
              <span>세상을 바꾸는 </span>
              <span>소프트웨어 인재를 키웁니다</span>
            </h1>
            <p className="home__subtitle">
              <span>AI·데이터·서비스 개발을 연결하는 실무 중심 교육으로</span>{' '}
              <span>내일의 문제를 해결하는 여성 IT 리더를 양성합니다.</span>
            </p>
            <div className="home__cta">
              <Link to="/about" className="btn btn--primary">
                학과 알아보기
              </Link>
              <Link to="/curriculum" className="btn btn--text">
                교육과정 보기 <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home__news container">
        <div className="home__notice-card">
          <p className="home__notice-eyebrow">Notice</p>
          <div className="home__notice-head">
            <h2>공지사항</h2>
            <Link to="/notice" className="home__see-all">
              전체보기 <span aria-hidden="true">+</span>
            </Link>
            <div className="home__notice-tabs">
              {NOTICE_FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={
                    noticeFilter === f.key ? 'home__notice-tab home__notice-tab--active' : 'home__notice-tab'
                  }
                  onClick={() => setNoticeFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <ul className="home__notice-list">
            {notices.map((notice) => (
              <li key={notice.id}>
                <span className="home__notice-category">{noticeCategoryLabel(notice)} ·</span>
                <Link to={`/notice/${notice.id}`}>{notice.title}</Link>
                <span className="home__notice-date">{formatNoticeDate(notice.publishedAt ?? notice.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="home__quick-links">
          {QUICK_LINKS.map((link) => (
            <Link to={link.to} key={link.id} className="home__quick-card">
              <span className="home__quick-icon">
                <img src={link.icon} alt="" />
              </span>
              <strong>{link.title}</strong>
              <span aria-hidden="true" className="home__quick-arrow">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home__projects container">
        <div className="home__projects-header">
          <h2>학생활동</h2>
          <Link to={`/activities/${ACTIVITY_LATEST_YEAR}`} className="home__see-all">
            전체보기 <span aria-hidden="true">+</span>
          </Link>
        </div>
        <div className="home__projects-grid">
          {projects.map((project) => (
            <Link to={`/activities/${ACTIVITY_LATEST_YEAR}/${project.id}`} className="project-card" key={project.id}>
              {project.thumbnailUrl ? (
                <img className="project-card__image" src={project.thumbnailUrl} alt="" />
              ) : (
                <div className="project-card__image project-card__image--empty" />
              )}
              <h3>{project.title}</h3>
              <span className="project-card__link">자세히 보기 →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
