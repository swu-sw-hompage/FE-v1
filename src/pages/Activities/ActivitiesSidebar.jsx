import { Link } from 'react-router-dom'
import { ACTIVITY_YEARS } from '../../constants/activities'

export default function ActivitiesSidebar({ activeYear }) {
  return (
    <aside className="activities__sidebar">
      <p className="activities__sidebar-label">ON THIS PAGE</p>
      <nav className="activities__year-nav">
        {ACTIVITY_YEARS.map((y) => (
          <Link
            key={y}
            to={`/activities/${y}`}
            className={
              y === activeYear
                ? 'activities__year-item activities__year-item--active'
                : 'activities__year-item'
            }
          >
            <span className="activities__year-rail" />
            {y}년도 졸업프로젝트
          </Link>
        ))}
      </nav>
    </aside>
  )
}
