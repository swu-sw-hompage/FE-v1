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

const noticeTime = (n) => new Date(n.publishedAt ?? n.createdAt ?? 0).getTime() || 0

// 상세 응답의 previousPost/nextPost는 분류와 상관없이 전체 공지 기준이라,
// 학사·취업 분류나 검색 결과 안에서 보던 경우엔 같은 조건의 목록을 받아 앞뒤 글을 직접 찾는다.
// 이전글 = 바로 전에 올라온(더 오래된) 글, 다음글 = 바로 뒤에 올라온(더 최근) 글.
// 현재 글이 그 목록에 없으면 null을 돌려주고, 화면에서는 서버 값을 그대로 쓴다.
export const getAdjacentNotices = async (id, { academic, employment, keyword, scope } = {}) => {
  const SIZE = 100
  const MAX_PAGES = 20
  const all = []
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const result = await getNotices({ academic, employment, keyword, scope, page, size: SIZE })
    const content = result?.content ?? []
    all.push(...content)
    const totalPages = result?.totalPages ?? 1
    if (content.length === 0 || page + 1 >= totalPages) break
  }

  // 고정글 여부와 상관없이 게시 시각 기준 최신순으로 정렬 (같으면 id 큰 쪽이 최신)
  const sorted = [...new Map(all.map((n) => [String(n.id), n])).values()].sort(
    (a, b) => noticeTime(b) - noticeTime(a) || Number(b.id) - Number(a.id),
  )
  const index = sorted.findIndex((n) => String(n.id) === String(id))
  if (index === -1) return null

  const pick = (n) => (n ? { id: n.id, title: n.title } : null)
  return {
    previousPost: pick(sorted[index + 1]),
    nextPost: pick(sorted[index - 1]),
  }
}

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
