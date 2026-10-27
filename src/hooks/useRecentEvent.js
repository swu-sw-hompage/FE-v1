import { useEffect, useState } from 'react'
import { fetchRecentEvent } from '../api/event'

// 최근 7일 안에 처음 게시된 학과 행사 (없으면 null). 홈 상단 띠와 헤더 메뉴 점에서 쓴다.
export default function useRecentEvent() {
  const [event, setEvent] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchRecentEvent().then((result) => {
      if (!cancelled) setEvent(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return event
}
