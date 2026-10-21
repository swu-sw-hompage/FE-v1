import { getNotices } from './notice'

// 백엔드는 필독을 먼저 정렬한 뒤 페이지를 나눠 응답한다.
// 따라서 최신순·필독만 보기에서는 전체 게시글을 모은 다음 정렬해야 한다.
const FETCH_SIZE = 100
const BATCH_SIZE = 4
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export const isNewNotice = (notice, now = Date.now()) => {
  const timestamp = Date.parse(notice.publishedAt ?? notice.createdAt ?? '')
  const age = now - timestamp
  return Number.isFinite(timestamp) && age >= 0 && age < WEEK_MS
}

export const sortNoticesNewestFirst = (notices) =>
  [...notices].sort((a, b) => {
    const dateA = Date.parse(a.publishedAt ?? a.createdAt ?? '') || 0
    const dateB = Date.parse(b.publishedAt ?? b.createdAt ?? '') || 0
    return dateB - dateA || Number(b.id) - Number(a.id)
  })

export const getNoticesNewestFirst = async (params = {}) => {
  const query = { ...params, page: 0, size: FETCH_SIZE }
  const first = await getNotices(query)
  const collected = [...(first?.content ?? [])]
  const totalPages = Math.max(1, first?.totalPages ?? 1)

  // 게시글이 100건을 넘더라도 모든 페이지를 조회한다.
  // 다수 요청으로 서버에 과부하가 생기지 않도록 4페이지씩 병렬 요청한다.
  for (let start = 1; start < totalPages; start += BATCH_SIZE) {
    const count = Math.min(BATCH_SIZE, totalPages - start)
    const batch = await Promise.all(
      Array.from({ length: count }, (_, i) => getNotices({ ...params, page: start + i, size: FETCH_SIZE })),
    )
    for (const response of batch) collected.push(...(response?.content ?? []))
  }

  return sortNoticesNewestFirst(collected)
}
