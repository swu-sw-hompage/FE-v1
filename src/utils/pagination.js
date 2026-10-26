// 페이지 번호를 전부 그리면 페이지가 많을 때(공지 수십 페이지 등) 줄이 화면 밖으로 넘친다.
// 현재 페이지를 가운데 두고 최대 size개만 보여준다. 예: 12페이지 중 7 → [5, 6, 7, 8, 9]
export const getPageWindow = (page, totalPages, size = 5) => {
  const count = Math.min(size, totalPages)
  const start = Math.min(Math.max(1, page - Math.floor(count / 2)), totalPages - count + 1)
  return Array.from({ length: count }, (_, i) => start + i)
}
