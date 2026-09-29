import { apiClient } from './client'

// 공개 조회 (게시된 졸업작품만)
export const getGraduationProjects = ({ year, page = 0, size = 20 } = {}) =>
  apiClient.get('/graduation-projects', { params: { year, page, size } })

export const getGraduationProjectById = (id) => apiClient.get(`/graduation-projects/${id}`)

// 관리자 전용 (JWT 필요)
export const createGraduationProject = (payload) => apiClient.post('/admin/graduation-projects', payload)

export const updateGraduationProject = (id, payload) =>
  apiClient.put(`/admin/graduation-projects/${id}`, payload)

export const deleteGraduationProject = (id) => apiClient.delete(`/admin/graduation-projects/${id}`)

export const publishGraduationProject = (id) => apiClient.patch(`/admin/graduation-projects/${id}/publish`)

// 관리자 목록 조회 (임시저장 포함 전체) — 공개 목록은 게시된 것만 내려주므로 별도 엔드포인트 사용
// NOTE: 백엔드에 /admin/graduation-projects GET이 아직 없다면 이 함수는 404가 날 수 있음 — 확인 필요
export const getAdminGraduationProjects = ({ year, page = 0, size = 20 } = {}) =>
  apiClient.get('/admin/graduation-projects', { params: { year, page, size } })
