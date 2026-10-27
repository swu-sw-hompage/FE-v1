import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import { getGraduationProjectById } from '../../api/graduation'
import { ACTIVITY_LATEST_YEAR, ACTIVITY_YEARS } from '../../constants/activities'
import ActivitiesSidebar from './ActivitiesSidebar'
import heroActivities from '../../assets/images/brand/hero-activities.jpg'
import './Activities.css'

export default function ActivityDetail() {
  const { year, id } = useParams()
  const activeYear = ACTIVITY_YEARS.includes(Number(year)) ? Number(year) : ACTIVITY_LATEST_YEAR
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

  const hasInfoRow = project && (project.teamName || project.section || project.members)

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
            <h2 className="activities__page-title">졸업프로젝트</h2>

            {loading && <p className="notice__loading">불러오는 중...</p>}

            {!loading && (error || !project) && (
              <div className="activity-detail__empty">
                <p>{error || '존재하지 않는 프로젝트입니다.'}</p>
                <Link to={`/activities/${activeYear}`}>← 목록으로</Link>
              </div>
            )}

            {!loading && project && (
              <div className="activity-detail__article">
                <div className="activity-detail__header">
                  <p className="activity-detail__title">{project.title}</p>
                  {(project.teamName || project.section) && (
                    <p className="activity-detail__subtitle">
                      {[project.teamName, project.section && `${project.section}분반`]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                  <div className="activity-detail__divider" />
                </div>

                {project.videoUrl ? (
                  <div className="activity-detail__video">
                    <iframe
                      src={project.videoUrl}
                      title={project.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : project.thumbnailUrl ? (
                  <img className="activity-detail__image" src={project.thumbnailUrl} alt="" />
                ) : (
                  <div className="activity-detail__image activity-detail__image--empty" />
                )}

                {project.summary && <p className="activity-detail__summary">{project.summary}</p>}

                {project.content && (
                  <div className="activity-detail__body">
                    {project.content.split('\n').map((line, i) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}

                {hasInfoRow && (
                  <div className="activity-detail__info">
                    {project.teamName && (
                      <div className="activity-detail__info-row">
                        <span className="activity-detail__info-label">팀명</span>
                        <span>{project.teamName}</span>
                      </div>
                    )}
                    <div className="activity-detail__info-row">
                      <span className="activity-detail__info-label">주제</span>
                      <span>{project.title}</span>
                    </div>
                    {project.section && (
                      <div className="activity-detail__info-row">
                        <span className="activity-detail__info-label">분반</span>
                        <span>{project.section}분반</span>
                      </div>
                    )}
                    {project.members && (
                      <div className="activity-detail__info-row">
                        <span className="activity-detail__info-label">이름</span>
                        <span>{project.members}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="activity-detail__actions">
                  <Link to={`/activities/${activeYear}`} className="activity-detail__back-btn">
                    목록으로
                  </Link>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
