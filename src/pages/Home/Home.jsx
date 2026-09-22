import { Link } from 'react-router-dom'
import heroHome from '../../assets/images/brand/hero-home.jpg'
import iconQuick1 from '../../assets/images/brand/icon-quick1.svg'
import iconQuick2 from '../../assets/images/brand/icon-quick2.svg'
import iconQuick3 from '../../assets/images/brand/icon-quick3.svg'
import { NOTICES } from '../../data/notices'
import { CAPSTONE_2025 } from '../../data/capstone2025'
import './Home.css'

const LATEST_NOTICES = NOTICES.slice(0, 5)
const LATEST_PROJECTS = CAPSTONE_2025.slice(0, 4)

const QUICK_LINKS = [
  { id: 'roadmap', icon: iconQuick3, title: '전공 로드맵', to: '/curriculum/roadmap' },
  { id: 'requirements', icon: iconQuick2, title: '졸업 요건', to: '/curriculum/requirements' },
  { id: 'notice-sub', icon: iconQuick1, title: '공지 알림 신청', to: '/notice/subscribe' },
]

export default function Home() {
  return (
    <div className="home">
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
              <span>AI·데이터·서비스 개발을 연결하는 실무 중심 교육으로</span>
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
              <span className="home__notice-tab home__notice-tab--active">전체</span>
              <span className="home__notice-tab">학사</span>
              <span className="home__notice-tab">취업</span>
            </div>
          </div>
          <ul className="home__notice-list">
            {LATEST_NOTICES.map((notice) => (
              <li key={notice.id}>
                <span className="home__notice-category">{notice.category} ·</span>
                <Link to={`/notice/${notice.id}`}>{notice.title}</Link>
                <span className="home__notice-date">{notice.date}</span>
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
          {LATEST_PROJECTS.map((project) => (
            <article className="project-card" key={project.id}>
              {project.thumb ? (
                <img className="project-card__image" src={project.thumb} alt="" />
              ) : (
                <div className="project-card__image project-card__image--empty" />
              )}
              <h3>{project.title}</h3>
              <Link to="/activities/2025" className="project-card__link">
                자세히 보기 →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
