// 학과 행사 (학과 활동 > 학과 행사)
//
// 시상식·전시회·특강처럼 공지사항에 올리기 애매한 학과 행사를 사진과 함께 모아 두는 곳.
// 1년에 몇 건 안 되기 때문에 우선은 백엔드 없이 이 파일에서 관리한다.
// (나중에 관리자 페이지에서 올리게 되면 이 배열을 /department-events API 응답으로 바꾸면 된다)
//
// 새 행사 추가하는 법
//  1. 사진을 public/images/events/<날짜-행사이름>/ 폴더에 넣는다 (예: public/images/events/2026-11-27-graduation/01.jpg)
//  2. 아래 배열에 항목을 하나 추가한다. 순서는 상관없음 (날짜순으로 자동 정렬)
//     {
//       id: 'graduation-2026',          // 주소에 쓰이는 값. 영문·숫자·하이픈만
//       date: '2026-11-27',             // 행사 날짜 (YYYY-MM-DD)
//       title: '2026 졸업작품 전시회 및 시상식',
//       summary: '목록에 보이는 한두 문장 소개',
//       content: '(선택) 상세에 보일 본문. 줄바꿈하면 문단이 나뉜다',
//       photos: ['/images/events/2026-11-27-graduation/01.jpg', ...],  // 첫 장이 대표 사진
//       postedAt: '2026-12-02',         // (선택) 사이트에 올린 날. 행사 며칠 뒤에 올릴 때 적으면 그날부터 7일 알림
//     },
//  3. main에 머지되면 홈 상단 띠와 메뉴 점이 7일 동안 자동으로 보인다.
const EVENTS = []

// 최신 행사가 위로 오도록 정렬해서 내보낸다
export const DEPARTMENT_EVENTS = [...EVENTS].sort((a, b) => b.date.localeCompare(a.date))

export const getDepartmentEvent = (id) => DEPARTMENT_EVENTS.find((event) => String(event.id) === String(id)) ?? null

// 새 행사는 올린 날(postedAt, 없으면 행사 날짜)부터 이 기간 동안만 홈 상단 띠 + 메뉴 점으로 알리고, 지나면 저절로 사라진다.
export const HOME_EVENT_VISIBLE_DAYS = 7

export const getRecentEvent = (now = Date.now()) => {
  const latest = DEPARTMENT_EVENTS[0]
  if (!latest) return null
  const ageDays = (now - Date.parse(latest.postedAt ?? latest.date)) / 86400000
  return ageDays >= 0 && ageDays <= HOME_EVENT_VISIBLE_DAYS ? latest : null
}

export const formatEventDate = (date) => date.replaceAll('-', '.')
