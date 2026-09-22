import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import { CAPSTONE_BY_YEAR } from '../../data/capstoneProjects'
import { ACTIVITY_YEARS } from '../../constants/activities'
import ActivitiesSidebar from './ActivitiesSidebar'
import './Activities.css'

const PAGE_SIZE = 12

export default function Activities() {
  const { year } = useParams()
  const activeYear = ACTIVITY_YEARS.includes(Number(year)) ? Number(year) : 2025
  const projects = CAPSTONE_BY_YEAR[activeYear] ?? []
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [activeYear])

  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visibleProjects = useMemo(
    () => projects.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [projects, currentPage],
  )

  return (
    <div className="activities">
      <PageHero photo title={['학생활동']} />

      <div className="container page-layout">
        <ActivitiesSidebar activeYear={activeYear} />

        <main className="page-layout__main">
          <section className="page-section">
            <h2>학생활동</h2>

            <div className="activities__project-grid">
              {visibleProjects.map((project) => (
                <Link
                  to={`/activities/${activeYear}/${project.id}`}
                  className="activities__project-card"
                  key={project.id}
                >
                  {project.thumb ? (
                    <img className="activities__project-image" src={project.thumb} alt="" />
                  ) : (
                    <div className="activities__project-image activities__project-image--empty" />
                  )}
                  <strong>{project.title}</strong>
                  <span className="activities__project-link">자세히 보기 →</span>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="activities__pagination">
                <button
                  type="button"
                  className="activities__page-arrow"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  aria-label="이전 페이지"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={
                      num === currentPage
                        ? 'activities__page-num activities__page-num--active'
                        : 'activities__page-num'
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
                  disabled={currentPage >= totalPages}
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
