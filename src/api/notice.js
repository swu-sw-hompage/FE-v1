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
// files가 있으면 multipart/form-data(request + files 파트)로, 없으면 순수 JSON으로 전송
const buildNoticeBody = (payload, files) => {
  if (!files || files.length === 0) return payload

  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  files.forEach((file) => formData.append('files', file))
  return formData
}

// FormData 전송 시 axios가 boundary를 포함한 Content-Type을 직접 계산하도록
// 인스턴스 기본값(application/json)을 명시적으로 제거해준다.
export const createNotice = (payload, files) =>
  apiClient.post('/admin/notices', buildNoticeBody(payload, files), {
    headers: files?.length ? { 'Content-Type': undefined } : undefined,
  })

export const updateNotice = (id, payload, files) =>
  apiClient.put(`/admin/notices/${id}`, buildNoticeBody(payload, files), {
    headers: files?.length ? { 'Content-Type': undefined } : undefined,
  })

export const deleteNotice = (id) => apiClient.delete(`/admin/notices/${id}`)

export const publishNotice = (id) => apiClient.patch(`/admin/notices/${id}/publish`)
