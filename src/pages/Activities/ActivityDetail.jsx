import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import { getGraduationProjectById } from '../../api/graduation'
import { ACTIVITY_YEARS } from '../../constants/activities'
import ActivitiesSidebar from './ActivitiesSidebar'
import heroActivities from '../../assets/images/brand/hero-activities.jpg'
import './Activities.css'

export default function ActivityDetail() {
  const { year, id } = useParams()
  const activeYear = ACTIVITY_YEARS.includes(Number(year)) ? Number(year) : 2025
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getGraduationProjectById(id)
      .then((result) => {
        if (!cancelled) setProject(result)
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
  }, [id])

  return (
    <div className="activities">
      <PageHero photo photoSrc={heroActivities} title={['학생활동']} />

      <div className="container page-layout">
        <ActivitiesSidebar activeYear={activeYear} />

        <main className="page-layout__main">
          <section className="page-section">
            {loading && <p className="notice__loading">불러오는 중...</p>}

            {!loading && (error || !project) && (
              <div className="activity-detail__empty">
                <p>{error || '존재하지 않는 프로젝트입니다.'}</p>
                <Link to={`/activities/${activeYear}`}>← 목록으로</Link>
              </div>
            )}

            {!loading && project && (
              <>
                <Link to={`/activities/${activeYear}`} className="activity-detail__back">
                  ← {activeYear}년도 졸업프로젝트 목록
                </Link>

                {project.thumbnailUrl ? (
                  <img className="activity-detail__image" src={project.thumbnailUrl} alt="" />
                ) : (
                  <div className="activity-detail__image activity-detail__image--empty" />
                )}

                <div className="activity-detail__meta">
                  <span>{project.year ?? activeYear}년도 졸업프로젝트</span>
                  {project.section && <span>{project.section}분반</span>}
                  {project.date && <span>{project.date}</span>}
                </div>

                <h1 className="activity-detail__title">{project.title}</h1>

                {project.summary && <p className="activity-detail__summary">{project.summary}</p>}

                {project.content && (
                  <div className="activity-detail__body">
                    {project.content.split('\n').map((line, i) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
