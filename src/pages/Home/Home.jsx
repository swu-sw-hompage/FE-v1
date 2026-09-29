import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import heroHome from '../../assets/images/brand/hero-home.jpg'
import iconQuick1 from '../../assets/images/brand/icon-quick1.svg'
import iconQuick2 from '../../assets/images/brand/icon-quick2.svg'
import iconQuick3 from '../../assets/images/brand/icon-quick3.svg'
import { getNotices, noticeCategoryLabel, formatNoticeDate } from '../../api/notice'
import { getGraduationProjects } from '../../api/graduation'
import './Home.css'

const QUICK_LINKS = [
  { id: 'roadmap', icon: iconQuick3, title: '전공 로드맵', to: '/curriculum/roadmap' },
  { id: 'requirements', icon: iconQuick2, title: '졸업 요건', to: '/curriculum/requirements' },
  { id: 'notice-sub', icon: iconQuick1, title: '공지 알림 신청', mobileTitle: '공지 알림', to: '/notice/subscribe' },
]

const NOTICE_FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'academic', label: '학사' },
  { key: 'employment', label: '취업' },
]

export default function Home() {
  const [notices, setNotices] = useState([])
  const [projects, setProjects] = useState([])
  const [noticeFilter, setNoticeFilter] = useState('all')

  useEffect(() => {
    getNotices({
      academic: noticeFilter === 'academic' ? true : undefined,
      employment: noticeFilter === 'employment' ? true : undefined,
      page: 0,
      size: 5,
    })
      .then((result) => setNotices(result?.content ?? []))
      .catch(() => setNotices([]))
  }, [noticeFilter])

  useEffect(() => {
    getGraduationProjects({ year: 2025, page: 0, size: 4 })
      .then((result) => setProjects(result?.content ?? []))
      .catch(() => setProjects([]))
  }, [])

  return (
    <div className="home">
      <section className="home__hero-mobile">
        <img className="home__hero-mobile-bg" src={heroHome} alt="" />
        <div className="home__hero-mobile-gradient" />
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
          <Link to="/activities/2025">전체보기</Link>
        </div>
        <div className="home__mobile-scroller">
          {projects.map((project) => (
            <Link to={`/activities/2025/${project.id}`} className="home__mobile-scroll-card" key={project.id}>
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

      <section className="home__hero">
        <img className="home__hero-bg" src={heroHome} alt="" />
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
          <Link to="/activities/2025" className="home__see-all">
            전체보기 <span aria-hidden="true">+</span>
          </Link>
        </div>
        <div className="home__projects-grid">
          {projects.map((project) => (
            <Link to={`/activities/2025/${project.id}`} className="project-card" key={project.id}>
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
