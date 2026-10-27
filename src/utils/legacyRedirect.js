// 예전 학과 홈페이지(워드프레스) 주소로 들어온 방문을 새 주소로 옮긴다. 검색 결과·즐겨찾기·다른 사이트에
// 남아 있는 예전 링크용. 라우터가 만들어지기 전에 주소만 바꾸므로 '페이지를 찾을 수 없습니다'가 깜빡이지 않는다.
// main.jsx에서 App보다 먼저 import해야 한다.

// 예전 공지 번호(?uid=) → 새 공지 id. 예전 사이트에서 옮겨온 공지만 해당한다 (BE import/notices-seed.json 기준).
const LEGACY_NOTICE_IDS = {
  404: 16, 764: 15, 801: 14, 806: 13, 888: 12, 903: 11, 972: 10, 999: 9,
  1050: 37, 1051: 36, 1054: 35, 1056: 34, 1057: 33, 1058: 32, 1059: 8, 1060: 31,
  1065: 30, 1070: 7, 1072: 6, 1073: 5, 1074: 4, 1096: 29, 1107: 3, 1115: 28,
  1122: 27, 1125: 26, 1128: 25, 1129: 24, 1133: 23, 1134: 22, 1135: 21, 1136: 20,
  1138: 2, 1139: 19, 1140: 1, 1149: 18, 1158: 17,
}

// 예전 사이트 전용 경로 (달력·댓글 피드·사이트맵 등). 새 사이트에 대응하는 화면이 없어 홈으로 보낸다.
const LEGACY_ONLY_SECTIONS = ['calendar', 'comments', 'feed', 'wp-content', 'wp-admin', 'wp-login.php', '사이트맵']

const legacyTarget = (segments, params) => {
  const [section, page = ''] = segments

  if (section === '공지사항') {
    const noticeId = params.get('mod') === 'document' ? LEGACY_NOTICE_IDS[params.get('uid')] : undefined
    return noticeId ? `/notice/${noticeId}` : '/notice'
  }
  if (section === '취업정보') {
    return page === '졸업생동정' ? '/about/career' : '/notice?filter=employment'
  }
  if (section === '학생활동') {
    // 졸업프로젝트 → 2020년, 2021년도-졸업프로젝트 → 2021년 (연도별 졸업프로젝트 페이지)
    if (page === '졸업프로젝트') return '/activities/2020'
    const year = page.match(/^(\d{4})년도/)?.[1]
    return year ? `/activities/${year}` : '/activities'
  }
  if (LEGACY_ONLY_SECTIONS.includes(section)) return '/'
  // 그 밖의 예전 한글 메뉴 주소는 새 사이트에 없으므로 홈으로 보낸다.
  if (/[가-힣]/.test(section)) return '/'
  return null
}

const findRedirect = () => {
  let path
  try {
    path = decodeURIComponent(window.location.pathname)
  } catch {
    return null
  }
  const segments = path.split('/').filter(Boolean)
  if (segments.length === 0) return null
  return legacyTarget(segments, new URLSearchParams(window.location.search))
}

/** 예전 주소로 들어와 옮겨진 경우 원래 경로 (방문 통계에 그대로 남기려고). 아니면 null. */
export let legacyLandingPath = null

const target = findRedirect()
if (target) {
  legacyLandingPath = window.location.pathname
  // 홍보 링크의 utm 같은 쿼리는 유입 경로 집계에 쓰이므로 새 주소에도 붙여 둔다.
  const [targetPath, targetQuery = ''] = target.split('?')
  const params = new URLSearchParams(targetQuery)
  new URLSearchParams(window.location.search).forEach((value, key) => {
    if (key.startsWith('utm_') || key === 'qa') params.set(key, value)
  })
  const query = params.toString()
  window.history.replaceState(null, '', `${targetPath}${query ? `?${query}` : ''}${window.location.hash}`)
}
