import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import ActivitiesSidebar from './ActivitiesSidebar'
import { ACTIVITY_LATEST_YEAR } from '../../constants/activities'
import { getDepartmentEvent, formatEventDate } from '../../data/departmentEvents'
import heroActivities from '../../assets/images/brand/hero-activities.jpg'
import './Activities.css'
import './DepartmentEvents.css'

// 사진 크게 보기. Esc·바깥 클릭으로 닫고, ←/→로 넘긴다.
function PhotoViewer({ photos, index, title, onClose, onMove }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onMove(1)
      if (e.key === 'ArrowLeft') onMove(-1)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, onMove])

  return (
    <div className="devent-viewer" role="dialog" aria-modal="true" aria-label={`${title} 사진`} onClick={onClose}>
      <button type="button" className="devent-viewer__close" onClick={onClose} aria-label="닫기">
        ×
      </button>
      {photos.length > 1 && (
        <button
          type="button"
          className="devent-viewer__nav devent-viewer__nav--prev"
          onClick={(e) => {
            e.stopPropagation()
            onMove(-1)
          }}
          aria-label="이전 사진"
        >
          ‹
        </button>
      )}
      <img
        className="devent-viewer__img"
        src={photos[index]}
        alt={`${title} 사진 ${index + 1}`}
        onClick={(e) => e.stopPropagation()}
      />
      {photos.length > 1 && (
        <button
          type="button"
          className="devent-viewer__nav devent-viewer__nav--next"
          onClick={(e) => {
            e.stopPropagation()
            onMove(1)
          }}
          aria-label="다음 사진"
        >
          ›
        </button>
      )}
      <p className="devent-viewer__count">
        {index + 1} / {photos.length}
      </p>
    </div>
  )
}

// 학과 행사 상세 — 글(제목·날짜·소개·본문)이 먼저, 사진은 같은 크기 썸네일로 모아 보여주고 누르면 크게 본다.
// 모양은 졸업프로젝트 상세(activity-detail)와 맞춘다.
export default function DepartmentEventDetail() {
  const { id } = useParams()
  const event = getDepartmentEvent(id)
  const [viewing, setViewing] = useState(null)

  const photos = event?.photos ?? []
  const move = (step) => setViewing((i) => (i + step + photos.length) % photos.length)

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
                  <p className="activity-detail__subtitle">{formatEventDate(event.date)}</p>
                  <div className="activity-detail__divider" />
                </div>

                {event.summary && <p className="activity-detail__summary">{event.summary}</p>}

                {event.content && (
                  <div className="activity-detail__body">
                    {event.content.split('\n').map((line, i) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}

                {photos.length > 0 && (
                  <div className="devent-gallery">
                    <p className="devent-gallery__label">사진 {photos.length}장</p>
                    <ul className="devent-photos">
                      {photos.map((src, i) => (
                        <li key={src}>
                          <button type="button" onClick={() => setViewing(i)} aria-label={`사진 ${i + 1} 크게 보기`}>
                            <img src={src} alt="" loading={i < 6 ? 'eager' : 'lazy'} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
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

      {viewing !== null && photos.length > 0 && (
        <PhotoViewer
          photos={photos}
          index={viewing}
          title={event.title}
          onClose={() => setViewing(null)}
          onMove={move}
        />
      )}
    </div>
  )
}
