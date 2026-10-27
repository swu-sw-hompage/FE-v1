import { Link, useParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import ActivitiesSidebar from './ActivitiesSidebar'
import { ACTIVITY_LATEST_YEAR } from '../../constants/activities'
import { getDepartmentEvent, formatEventDate } from '../../data/departmentEvents'
import heroActivities from '../../assets/images/brand/hero-activities.jpg'
import './Activities.css'
import './DepartmentEvents.css'

// 학과 행사 상세 — 제목·날짜·소개와 사진 모음. 모양은 졸업프로젝트 상세(activity-detail)와 맞춘다.
export default function DepartmentEventDetail() {
  const { id } = useParams()
  const event = getDepartmentEvent(id)

  return (
    <div className="activities">
      <PageHero photo photoSrc={heroActivities} title={['학생활동']} />

      <nav className="activities__mobile-tabs" aria-label="학생활동 분류">
        <Link to={`/activities/${ACTIVITY_LATEST_YEAR}`} className="activities__mobile-tab">
          졸업프로젝트
        </Link>
        <Link to="/activities/events" className="activities__mobile-tab is-active">
          학과 행사
        </Link>
      </nav>

      <div className="container page-layout">
        <ActivitiesSidebar activeKey="events" />

        <main className="page-layout__main">
          <section className="page-section">
            <h2 className="activities__page-title">학과 행사</h2>

            {!event ? (
              <div className="activity-detail__empty">
                <p>존재하지 않는 행사입니다.</p>
                <Link to="/activities/events">← 목록으로</Link>
              </div>
            ) : (
              <div className="activity-detail__article">
                <div className="activity-detail__header">
                  <p className="activity-detail__title">{event.title}</p>
                  <p className="activity-detail__subtitle">
                    {formatEventDate(event.date)} · 사진 {event.photos.length}장
                  </p>
                  <div className="activity-detail__divider" />
                </div>

                {event.summary && <p className="activity-detail__summary">{event.summary}</p>}

                {event.photos.length > 0 && (
                  <ul className="devent-photos">
                    {event.photos.map((src, i) => (
                      <li key={src}>
                        <a href={src} target="_blank" rel="noreferrer" aria-label={`사진 ${i + 1} 크게 보기`}>
                          <img src={src} alt={`${event.title} 사진 ${i + 1}`} loading={i < 4 ? 'eager' : 'lazy'} />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="activity-detail__actions">
                  <Link to="/activities/events" className="activity-detail__back-btn">
                    목록으로
                  </Link>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
