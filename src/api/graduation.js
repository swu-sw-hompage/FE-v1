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

// 졸업작품은 생성/수정 시 status(DRAFT|PUBLISHED)를 함께 보내는 방식이라 별도 게시 API가 없다.
// 목록/상세 조회도 게시된 작품만 내려주는 공개 엔드포인트만 존재하며, 관리자 전용 목록 조회는 없다
// (임시저장은 생성 직후 응답으로만 확인 가능하고 이후 다시 불러올 방법이 없음).
