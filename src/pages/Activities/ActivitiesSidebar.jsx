import { Link } from 'react-router-dom'
import { ACTIVITY_YEARS } from '../../constants/activities'
import '../../components/common/ChapterNav.css'

// 다른 페이지(학과 소개 등)의 ChapterNav와 똑같은 모양을 쓰도록 같은 클래스를 사용한다.
// 활성 항목은 activeKey('events' = 학과 행사) 또는 activeYear(졸업프로젝트 연도)로 정한다.
// 모바일에서는 학생활동 페이지 자체 상단 탭을 쓰므로 이 사이드바는 숨김(.activities__sidebar).
export default function ActivitiesSidebar({ activeYear, activeKey }) {
  const items = [
    { key: 'events', to: '/activities/events', label: '학과 행사', active: activeKey === 'events' },
    ...ACTIVITY_YEARS.map((y) => ({
      key: y,
      to: `/activities/${y}`,
      label: `${y}년도 졸업프로젝트`,
      active: activeKey !== 'events' && y === activeYear,
    })),
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
