import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatEventDate } from '../../api/event'
import useRecentEvent from '../../hooks/useRecentEvent'
import './EventAnnouncement.css'

const DISMISS_KEY = 'swu_dismissed_event'

const readDismissed = () => {
  try {
    return localStorage.getItem(DISMISS_KEY)
  } catch {
    return null
  }
}

// 새 학과 행사 알림 띠 (홈 헤더 바로 아래).
// 처음 게시한 날부터 7일(HOME_EVENT_VISIBLE_DAYS) 동안만 보이고 저절로 사라진다.
// 닫으면 그 행사는 이 브라우저에서 다시 안 뜨고, 다음 행사가 올라오면 다시 뜬다.
export default function EventAnnouncement() {
  const event = useRecentEvent()
  const [dismissedId, setDismissedId] = useState(readDismissed)

  if (!event || dismissedId === String(event.id)) return null

  const dismiss = () => {
    setDismissedId(String(event.id))
    try {
      localStorage.setItem(DISMISS_KEY, String(event.id))
    } catch {
      // 저장 못 해도 이번 화면에서는 닫힌다.
    }
  }

  return (
    <div className="event-bar" role="region" aria-label="새 학과 행사">
      <div className="event-bar__inner">
        <Link to={`/activities/events/${event.id}`} className="event-bar__link">
          <span className="event-bar__label">NEW</span>
          <span className="event-bar__text">
            <strong>{event.title}</strong>
            <span className="event-bar__date">{formatEventDate(event.date)}</span>
          </span>
          <span className="event-bar__more">
            사진 보기 <span aria-hidden="true">→</span>
          </span>
        </Link>
        <button type="button" className="event-bar__close" onClick={dismiss} aria-label="알림 닫기">
          ×
        </button>
      </div>
    </div>
  )
}
