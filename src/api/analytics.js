import { apiClient } from './client'
import { legacyLandingPath } from '../utils/legacyRedirect'

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

// 알림 메일 링크는 ?utm_source=email, 홍보 링크는 ?utm_source=채널&utm_campaign=이름을 달고 온다
// (/dev/stats의 홍보 링크 만들기). 캠페인이 있으면 "채널:캠페인"으로 기록한다.
// 그 외에는 리퍼러 도메인, 없으면 direct.
const visitSource = () => {
  const params = new URLSearchParams(window.location.search)
  const utm = params.get('utm_source')
  const campaign = params.get('utm_campaign')
  if (utm) return (campaign ? `${utm}:${campaign}` : utm).toLowerCase().slice(0, 100)
  if (!document.referrer) return 'direct'
  try {
    const host = new URL(document.referrer).hostname
    return host === window.location.hostname ? 'internal' : host.slice(0, 100)
  } catch {
    return 'direct'
  }
}

// 검색엔진 봇·자동화 브라우저는 사람 방문이 아니라서 뺀다 (봇이 예전 달력 주소를 수백 번 긁어 간 적이 있다).
const isBot = () => {
  try {
    return navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse/i.test(navigator.userAgent)
  } catch {
    return false
  }
}

const send = (event) => {
  // 로컬 개발 중 방문은 운영 통계에 섞이지 않게 보내지 않는다.
  if (import.meta.env.DEV || isQaBrowser() || isBot()) return
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
  // 예전 주소로 들어와 새 주소로 옮겨졌으면 원래 들어온 예전 주소를 남긴다.
  const path = legacyLandingPath ?? window.location.pathname
  send({ type: 'VISIT', path: path.slice(0, 255), source: visitSource() })
}

/** 알림 신청에 같이 실어 보내서, 신청이 어느 유입 경로에서 왔는지 통계에서 이어 볼 수 있게 한다. */
export const visitorIdForAttribution = () => (import.meta.env.DEV || isQaBrowser() ? undefined : visitorId())

export const trackSubscribePageView = () =>
  send({ type: 'SUBSCRIBE_PAGE_VIEW', path: window.location.pathname.slice(0, 255) })

/** 홍보 팝업 노출(PROMO_VIEW)·클릭(PROMO_CLICK). source에 홍보 key를 실어 홍보별로 집계한다. */
export const trackPromo = (type, promoKey) =>
  send({ type, path: window.location.pathname.slice(0, 255), source: promoKey.slice(0, 100) })

export const getDevStats = ({ key, days }) =>
  apiClient.get('/dev/stats', { params: { days }, headers: { 'X-Stats-Key': key } })
