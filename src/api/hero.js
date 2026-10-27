import { apiClient } from './client'

// 메인 hero 슬라이드 사진. 기본 사진 3장은 백엔드에 들어 있어 '/attachments/hero/...'처럼
// 사이트 경로로 오고, 관리자가 올린 사진은 전체 URL로 온다.
export const getHeroSlides = () => apiClient.get('/hero-slides')

// 사이트 경로는 백엔드 주소 기준으로 바꾼다 (운영은 같은 도메인이라 그대로, 로컬은 localhost:8080).
export const heroImageUrl = (url) => {
  if (!url?.startsWith('/')) return url
  const base = import.meta.env.VITE_API_BASE_URL
  if (!base || base.startsWith('/')) return url
  return new URL(base).origin + url
}

// 관리자 전용 (JWT 필요)
export const getAdminHeroSlides = () => apiClient.get('/admin/hero-slides')

export const createHeroSlide = ({ imageUrl, altText }) => apiClient.post('/admin/hero-slides', { imageUrl, altText })

export const updateHeroSlide = (id, { altText }) => apiClient.put(`/admin/hero-slides/${id}`, { altText })

export const reorderHeroSlides = (ids) => apiClient.put('/admin/hero-slides/order', { ids })

export const deleteHeroSlide = (id) => apiClient.delete(`/admin/hero-slides/${id}`)
