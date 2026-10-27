import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import { getGraduationProjects } from '../../api/graduation'
import { ACTIVITY_LATEST_YEAR, ACTIVITY_YEARS } from '../../constants/activities'
import ActivitiesSidebar from './ActivitiesSidebar'
import heroActivities from '../../assets/images/brand/hero-activities.jpg'
import './Activities.css'
import { getPageWindow } from '../../utils/pagination'

const PAGE_SIZE = 12

export default function Activities() {
  const { year } = useParams()
  const navigate = useNavigate()
  const activeYear = ACTIVITY_YEARS.includes(Number(year)) ? Number(year) : ACTIVITY_LATEST_YEAR
  const [page, setPage] = useState(1)
  const [projects, setProjects] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setPage(1)
  }, [activeYear])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getGraduationProjects({ year: activeYear, page: page - 1, size: PAGE_SIZE })
      .then((result) => {
        if (cancelled) return
        setProjects(result?.content ?? [])
        setTotalPages(Math.max(1, result?.totalPages ?? 1))
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [activeYear, page])

  return (
    <div className="activities">
      <PageHero photo photoSrc={heroActivities} title={['학과 활동']} />

      <nav className="activities__mobile-tabs" aria-label="학과 활동 분류">
        <Link to={`/activities/${activeYear}`} className="activities__mobile-tab is-active">
          학생활동
        </Link>
        <Link to="/activities/events" className="activities__mobile-tab">
          학과 행사
        </Link>
      </nav>

      <div className="container page-layout">
        <ActivitiesSidebar activeYear={activeYear} />

        <main className="page-layout__main">
          <section className="page-section">
            <h2>학생활동</h2>

            <div className="activities__year-select-wrap">
              <select
                className="activities__year-select"
                value={activeYear}
                onChange={(e) => navigate(`/activities/${e.target.value}`)}
                aria-label="졸업 연도 선택"
              >
                {ACTIVITY_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}년도 졸업프로젝트
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="notice__error">{error}</p>}
            {!error && loading && <p className="notice__loading">불러오는 중...</p>}
            {!error && !loading && projects.length === 0 && (
              <p className="notice__empty">등록된 졸업프로젝트가 없습니다.</p>
            )}

            {!error && !loading && projects.length > 0 && (
              <div className="activities__project-grid">
                {projects.map((project) => (
                  <Link
                    to={`/activities/${activeYear}/${project.id}`}
                    className="activities__project-card"
                    key={project.id}
                  >
                    {project.thumbnailUrl ? (
                      <img className="activities__project-image" src={project.thumbnailUrl} alt="" />
                    ) : (
                      <div className="activities__project-image activities__project-image--empty" />
                    )}
                    <strong>{project.title}</strong>
                    <span className="activities__project-link">자세히 보기 →</span>
                  </Link>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="activities__pagination">
                <button
                  type="button"
                  className="activities__page-arrow"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  aria-label="이전 페이지"
                >
                  ‹
                </button>
                {getPageWindow(page, totalPages).map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={
                      num === page ? 'activities__page-num activities__page-num--active' : 'activities__page-num'
                    }
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  className="activities__page-arrow"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  aria-label="다음 페이지"
                >
                  ›
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
