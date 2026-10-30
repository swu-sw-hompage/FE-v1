import { apiClient } from './client'

// 학과 행사 (학과 활동 > 학과 행사). 관리자 페이지에서 올리고, 공개 화면은 게시된 행사만 받는다.
// 서버 응답의 eventDate('YYYY-MM-DD')를 화면에서 쓰기 편하게 date로도 넣어 둔다.
const toEvent = (event) => (event ? { ...event, date: event.eventDate, photos: event.photos ?? [] } : null)
const toPage = (page) => ({ ...page, content: (page?.content ?? []).map(toEvent) })

// 공개 조회 (게시된 행사만, 행사 날짜 최신순). 1년에 몇 건이라 한 번에 넉넉히 받는다.
export const getDepartmentEvents = ({ page = 0, size = 100 } = {}) =>
  apiClient.get('/department-events', { params: { page, size } }).then(toPage)

export const getDepartmentEventById = (id) => apiClient.get(`/department-events/${id}`).then(toEvent)

// 관리자 전용 (JWT 필요). 임시저장 글까지 행사 날짜 최신순으로 내려온다.
export const getAdminDepartmentEvents = ({ page = 0, size = 10 } = {}) =>
  apiClient.get('/admin/department-events', { params: { page, size } }).then(toPage)

export const getAdminDepartmentEventById = (id) => apiClient.get(`/admin/department-events/${id}`).then(toEvent)

// payload: { title, eventDate: 'YYYY-MM-DD', summary, content, photos: [url, ...], status: 'DRAFT' | 'PUBLISHED' }
// photos는 /admin/uploads로 올린 사진 url을 보여줄 순서대로. 첫 장이 대표 사진.
export const createDepartmentEvent = (payload) => apiClient.post('/admin/department-events', payload).then(toEvent)

export const updateDepartmentEvent = (id, payload) =>
  apiClient.put(`/admin/department-events/${id}`, payload).then(toEvent)

export const deleteDepartmentEvent = (id) => apiClient.delete(`/admin/department-events/${id}`)

export const formatEventDate = (date) => (date ? String(date).replaceAll('-', '.') : '')

// 새 행사는 처음 게시한 날(postedAt)부터 이 기간 동안만 홈 상단 띠로 알리고, 지나면 저절로 사라진다.
export const HOME_EVENT_VISIBLE_DAYS = 7

const isRecent = (event, now) => {
  if (!event) return false
  const ageDays = (now - Date.parse(event.postedAt ?? event.date)) / 86400000
  return ageDays >= 0 && ageDays <= HOME_EVENT_VISIBLE_DAYS
}

// 홈에 다시 들어올 때마다 요청하지 않도록 한 번 받은 결과를 같이 쓴다.
let recentEventRequest = null
export const fetchRecentEvent = () => {
  if (!recentEventRequest) {
    recentEventRequest = getDepartmentEvents({ size: 1 })
      .then((page) => {
        const latest = page.content[0] ?? null
        return isRecent(latest, Date.now()) ? latest : null
      })
      .catch(() => {
        recentEventRequest = null
        return null
      })
  }
  return recentEventRequest
}
