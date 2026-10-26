import { apiClient } from './client'

// 익명 방문 통계. 브라우저마다 랜덤 ID 하나만 localStorage에 두고, 개인을 식별하는 정보는 보내지 않는다.
const VISITOR_KEY = 'swu_visitor_id'
const VISIT_TRACKED_KEY = 'swu_visit_tracked'
const QA_KEY = 'swu_qa'

// 개발자 브라우저는 통계에서 뺀다. 아무 페이지에 ?qa=1을 붙여 한 번 열면 이 브라우저는 계속 제외되고,
// ?qa=0으로 열면 다시 집계된다.
const isQaBrowser = () => {
  try {
    const qa = new URLSearchParams(window.location.search).get('qa')
    if (qa === '1') localStorage.setItem(QA_KEY, '1')
    if (qa === '0') localStorage.removeItem(QA_KEY)
    return localStorage.getItem(QA_KEY) === '1'
  } catch {
    return false
  }
}

const newId = () =>
  crypto.randomUUID?.() ??
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })

const visitorId = () => {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = newId()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return undefined
  }
}

// 알림 메일 링크는 ?utm_source=email을 달고 온다. 그 외에는 리퍼러 도메인, 없으면 direct.
const visitSource = () => {
  const utm = new URLSearchParams(window.location.search).get('utm_source')
  if (utm) return utm.toLowerCase().slice(0, 100)
  if (!document.referrer) return 'direct'
  try {
    const host = new URL(document.referrer).hostname
    return host === window.location.hostname ? 'internal' : host.slice(0, 100)
  } catch {
    return 'direct'
  }
}

const send = (event) => {
  // 로컬 개발 중 방문은 운영 통계에 섞이지 않게 보내지 않는다.
  if (import.meta.env.DEV || isQaBrowser()) return
  apiClient.post('/analytics/events', { ...event, visitorId: visitorId() }).catch(() => {})
}

/** 탭(세션)마다 처음 들어온 페이지 한 번만 방문으로 기록한다. */
export const trackVisit = () => {
  try {
    if (sessionStorage.getItem(VISIT_TRACKED_KEY)) return
    sessionStorage.setItem(VISIT_TRACKED_KEY, '1')
  } catch {
    // 저장소를 못 쓰는 브라우저는 페이지를 열 때마다 기록되지만 통계가 막히지는 않는다.
  }
  send({ type: 'VISIT', path: window.location.pathname.slice(0, 255), source: visitSource() })
}

export const trackSubscribePageView = () =>
  send({ type: 'SUBSCRIBE_PAGE_VIEW', path: window.location.pathname.slice(0, 255) })

export const getDevStats = ({ key, days }) =>
  apiClient.get('/dev/stats', { params: { days }, headers: { 'X-Stats-Key': key } })
