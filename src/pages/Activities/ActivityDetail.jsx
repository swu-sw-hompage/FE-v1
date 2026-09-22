import { Link, useParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import { CAPSTONE_BY_YEAR } from '../../data/capstoneProjects'
import { ACTIVITY_YEARS } from '../../constants/activities'
import ActivitiesSidebar from './ActivitiesSidebar'
import './Activities.css'

export default function ActivityDetail() {
  const { year, id } = useParams()
  const activeYear = ACTIVITY_YEARS.includes(Number(year)) ? Number(year) : 2025
  const projects = CAPSTONE_BY_YEAR[activeYear] ?? []
  const project = projects.find((p) => String(p.id) === id)

  return (
    <div className="activities">
      <PageHero photo title={['학생활동']} />

      <div className="container page-layout">
        <ActivitiesSidebar activeYear={activeYear} />

        <main className="page-layout__main">
          <section className="page-section">
            {!project ? (
              <div className="activity-detail__empty">
                <p>존재하지 않는 프로젝트입니다.</p>
                <Link to={`/activities/${activeYear}`}>← 목록으로</Link>
              </div>
            ) : (
              <>
                <Link to={`/activities/${activeYear}`} className="activity-detail__back">
                  ← {activeYear}년도 졸업프로젝트 목록
                </Link>

                {project.thumb ? (
                  <img className="activity-detail__image" src={project.thumb} alt="" />
                ) : (
                  <div className="activity-detail__image activity-detail__image--empty" />
                )}

                <div className="activity-detail__meta">
                  <span>{activeYear}년도 졸업프로젝트</span>
                  {project.section && <span>{project.section}분반</span>}
                  <span>{project.date}</span>
                </div>

                <h1 className="activity-detail__title">{project.title}</h1>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
