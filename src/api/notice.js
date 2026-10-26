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
// status: 'PUBLISHED'(기본) | 'DRAFT'. 임시저장 글은 최근 수정순으로 내려온다.
export const getAdminNotices = ({ status, academic, employment, keyword, page = 0, size = 10 } = {}) =>
  apiClient.get('/admin/notices', {
    params: { status, academic, employment, keyword: keyword || undefined, page, size },
  })

// 임시저장 글도 포함해서 한 건 조회 (공지 수정 화면용)
export const getAdminNoticeById = (id) => apiClient.get(`/admin/notices/${id}`)

// 첨부파일은 별도 업로드 API가 없어 파일이 아닌 {name, url} 링크 형태로만 등록 가능하다.
export const createNotice = (payload) => apiClient.post('/admin/notices', payload)

export const updateNotice = (id, payload) => apiClient.put(`/admin/notices/${id}`, payload)

export const deleteNotice = (id) => apiClient.delete(`/admin/notices/${id}`)

export const publishNotice = (id) => apiClient.patch(`/admin/notices/${id}/publish`)

// 예약 게시: scheduledAt은 'YYYY-MM-DDTHH:mm' (한국 시간). 그 시각이 지나면 서버가 게시하고 알림 메일을 보낸다.
export const scheduleNotice = (id, scheduledAt) =>
  apiClient.put(`/admin/notices/${id}/schedule`, { scheduledAt })

export const cancelNoticeSchedule = (id) => apiClient.delete(`/admin/notices/${id}/schedule`)

// '2026.10.28 09:00' 형태
export const formatScheduleTime = (value) => {
  if (!value) return ''
  const [date, time = ''] = String(value).split('T')
  return `${date.replaceAll('-', '.')} ${time.slice(0, 5)}`
}

// 첨부파일 업로드: 응답 { name, url }을 attachments에 그대로 넣으면 된다.
// client 기본 헤더가 JSON이라 multipart로 덮어써야 FormData가 JSON으로 바뀌지 않는다.
export const uploadAttachment = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return apiClient.post('/admin/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
}
