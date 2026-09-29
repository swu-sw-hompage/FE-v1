import { apiClient } from './client'

// 관리자 전용 — 공지 알림 신청자 목록
// NOTE: 백엔드에 아직 확정되지 않은 엔드포인트. 실제 경로/응답 필드명은 백엔드팀과 확인 필요.
export const getSubscribers = ({ academic, employment, verified, keyword, page = 0, size = 20 } = {}) =>
  apiClient.get('/admin/notifications/subscribers', {
    params: { academic, employment, verified, keyword: keyword || undefined, page, size },
  })

export const deleteSubscriber = (id) => apiClient.delete(`/admin/notifications/subscribers/${id}`)

export const deleteSubscribers = (ids) =>
  apiClient.delete('/admin/notifications/subscribers', { data: { ids } })
