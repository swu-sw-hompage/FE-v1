import { apiClient } from './client'

// 공개 조회 (게시된 공지만)
export const getNotices = ({ academic, employment, page = 0, size = 20 } = {}) =>
  apiClient.get('/notices', { params: { academic, employment, page, size } })

export const getNoticeById = (id) => apiClient.get(`/notices/${id}`)

// 관리자 전용 (JWT 필요)
export const createNotice = (payload) => apiClient.post('/admin/notices', payload)

export const updateNotice = (id, payload) => apiClient.put(`/admin/notices/${id}`, payload)

export const deleteNotice = (id) => apiClient.delete(`/admin/notices/${id}`)

export const publishNotice = (id) => apiClient.patch(`/admin/notices/${id}/publish`)
