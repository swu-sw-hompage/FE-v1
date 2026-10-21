import { apiClient } from './client'

// 관리자 전용 — 공지 알림 신청자 목록 (keyword로 이메일/이름/학번 검색만 지원, 분류/인증 필터는 서버에 없음)
export const getSubscribers = ({ keyword, page = 0, size = 20 } = {}) =>
  apiClient.get('/admin/subscribers', {
    params: { keyword: keyword || undefined, page, size },
  })

export const deleteSubscriber = (id) => apiClient.delete(`/admin/subscribers/${id}`)
