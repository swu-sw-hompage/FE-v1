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
