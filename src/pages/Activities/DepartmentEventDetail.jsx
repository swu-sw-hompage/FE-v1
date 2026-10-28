import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import EmptyState from '../../components/common/EmptyState'
import ActivitiesSidebar from './ActivitiesSidebar'
import { ACTIVITY_LATEST_YEAR } from '../../constants/activities'
import { getDepartmentEventById, formatEventDate } from '../../api/event'
import heroActivities from '../../assets/images/brand/hero-activities.jpg'
import './Activities.css'
import './DepartmentEvents.css'

// 대표 사진 다음에 처음부터 보여줄 사진 수. 2칸이라 짝수로 둔다.
const PREVIEW_COUNT = 6

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
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadError(false)
    setViewing(null)
    setShowAll(false)
    getDepartmentEventById(id)
      .then((result) => {
        if (!cancelled) setEvent(result)
      })
      .catch((err) => {
        if (cancelled) return
        setEvent(null)
        // 404(없는 글·임시저장 글)는 '찾을 수 없음', 그 외는 불러오기 실패로 구분
        if (err.status !== 404) setLoadError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const photos = event?.photos ?? []
  // 대표 사진은 크게, 나머지는 2칸으로. 사진이 많으면 처음엔 PREVIEW_COUNT장만 보여준다.
  const rest = photos.slice(1)
  const visibleRest = showAll ? rest : rest.slice(0, PREVIEW_COUNT)
  const hiddenCount = rest.length - visibleRest.length
  const move = (step) => setViewing((i) => (i + step + photos.length) % photos.length)

  return (
    <div className="activities">
      <PageHero photo photoSrc={heroActivities} title={['학과 활동']} />

      <nav className="activities__mobile-tabs" aria-label="학과 활동 분류">
        <Link to={`/activities/${ACTIVITY_LATEST_YEAR}`} className="activities__mobile-tab">
          학생 활동
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

            {loading ? (
              <p className="devents__status">불러오는 중...</p>
            ) : loadError ? (
              <EmptyState
                title="행사를 불러오지 못했습니다"
                description="잠시 후 다시 시도해 주세요."
                actions={[{ label: '목록으로 돌아가기', to: '/activities/events' }]}
              />
            ) : !event ? (
              <EmptyState
                title="행사를 찾을 수 없습니다"
                description="삭제되었거나 주소가 바뀌었을 수 있어요. 목록에서 다시 찾아봐 주세요."
                actions={[{ label: '목록으로 돌아가기', to: '/activities/events' }]}
              />
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
                    <button
                      type="button"
                      className="devent-cover"
                      onClick={() => setViewing(0)}
                      aria-label="사진 1 크게 보기"
                    >
                      <img src={photos[0]} alt="" />
                    </button>
                    {photos.length > 1 && (
                      <ul className="devent-photos">
                        {visibleRest.map((src, i) => (
                          <li key={src}>
                            <button
                              type="button"
                              onClick={() => setViewing(i + 1)}
                              aria-label={`사진 ${i + 2} 크게 보기`}
                            >
                              <img src={src} alt="" loading={i < 4 ? 'eager' : 'lazy'} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {hiddenCount > 0 && (
                      <button type="button" className="devent-gallery__more" onClick={() => setShowAll(true)}>
                        사진 {hiddenCount}장 더 보기
                      </button>
                    )}
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
