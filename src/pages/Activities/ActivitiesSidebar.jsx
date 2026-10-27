import { Link } from 'react-router-dom'
import { ACTIVITY_LATEST_YEAR } from '../../constants/activities'
import '../../components/common/ChapterNav.css'

// 다른 페이지(학과 소개 등)의 ChapterNav와 똑같은 모양을 쓰도록 같은 클래스를 사용한다.
// activeKey가 'events'면 학과 행사, 아니면 학생활동(졸업프로젝트)이 활성. activeYear는 학생활동 링크의 연도.
// 모바일에서는 학과 활동 페이지 자체 상단 탭을 쓰므로 이 사이드바는 숨김(.activities__sidebar).
export default function ActivitiesSidebar({ activeYear, activeKey }) {
  // 메뉴(학과 활동 → 학생활동 / 학과 행사)와 같은 두 항목만 둔다.
  // 졸업프로젝트 연도는 사이드바에 늘어놓지 않고 학생활동 페이지 안의 연도 선택에서 고른다.
  const items = [
    {
      key: 'projects',
      to: `/activities/${activeYear ?? ACTIVITY_LATEST_YEAR}`,
      label: '학생활동',
      active: activeKey !== 'events',
    },
    { key: 'events', to: '/activities/events', label: '학과 행사', active: activeKey === 'events' },
  ]

  return (
    <aside className="activities__sidebar">
      <nav className="chapter-nav" aria-label="페이지 내 이동">
        <p className="chapter-nav__label">ON THIS PAGE</p>
        <ul className="chapter-nav__list">
          {items.map((item) => (
            <li key={item.key} className={item.active ? 'is-active' : ''}>
              <span className="chapter-nav__bar" />
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
