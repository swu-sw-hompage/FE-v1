const ACTIVITY_START_YEAR = 2020

// 매년 새 연도를 추가하기 위해 코드를 수정할 필요가 없도록,
// 시작 연도부터 올해까지를 내림차순으로 자동 생성한다.
export const ACTIVITY_YEARS = Array.from(
  { length: new Date().getFullYear() - ACTIVITY_START_YEAR + 1 },
  (_, i) => new Date().getFullYear() - i,
)

export const ACTIVITY_SOURCE_URLS = {
  2020: 'http://sw.swu.ac.kr/학생활동/졸업프로젝트/',
  2021: 'http://sw.swu.ac.kr/학생활동/2021년도-졸업프로젝트/',
  2022: 'http://sw.swu.ac.kr/학생활동/2022년도-졸업프로젝트/',
  2023: 'http://sw.swu.ac.kr/학생활동/2023년도-졸업프로젝트-2/',
  2024: 'http://sw.swu.ac.kr/학생활동/2024년도-졸업작품전시회-2/',
  2025: 'http://sw.swu.ac.kr/학생활동/2025년도-졸업프로젝트/',
}
