import { apiClient } from './client'

export const noticeCategoryLabel = (notice) => {
  if (notice.academicNotice) return '학사'
  if (notice.employmentNotice) return '취업'
  return ''
}

// 백엔드가 시:분:초까지 포함한 타임스탬프를 내려줘도 화면에는 YYYY.MM.DD만 표시
export const formatNoticeDate = (value) => {
  if (!value) return ''
  return String(value)
    .trim()
    .split(/[ T]/)[0]
    .replaceAll('-', '.')
}

// 공개 조회 (게시된 공지만)
// scope: 'title-body'(기본, 제목+내용) | 'title' | 'body'
export const getNotices = ({ academic, employment, keyword, scope, page = 0, size = 20 } = {}) =>
  apiClient.get('/notices', {
    params: { academic, employment, keyword: keyword || undefined, scope, page, size },
  })

export const getNoticeById = (id) => apiClient.get(`/notices/${id}`)

// 관리자 전용 (JWT 필요)
// 첨부파일은 별도 업로드 API가 없어 파일이 아닌 {name, url} 링크 형태로만 등록 가능하다.
export const createNotice = (payload) => apiClient.post('/admin/notices', payload)

export const updateNotice = (id, payload) => apiClient.put(`/admin/notices/${id}`, payload)

export const deleteNotice = (id) => apiClient.delete(`/admin/notices/${id}`)

export const publishNotice = (id) => apiClient.patch(`/admin/notices/${id}/publish`)

// 관리자 전용 목록/임시저장 조회 API는 없다 — 목록/상세 조회는 게시된 공지만 내려주는
// 공개 엔드포인트(getNotices/getNoticeById)만 존재하며, 임시저장 글은 생성 직후 응답으로만
// 확인 가능하고 이후 다시 불러올 방법이 없다.
