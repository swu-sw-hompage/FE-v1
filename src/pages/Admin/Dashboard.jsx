import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import { getNotices } from '../../api/notice'
import { getGraduationProjects } from '../../api/graduation'
import { getAdminEmail } from '../../api/auth'
import './Admin.css'

export default function Dashboard() {
  const [notices, setNotices] = useState([])
  const [noticeTotal, setNoticeTotal] = useState(0)
  const [projects, setProjects] = useState([])
  const [projectTotal, setProjectTotal] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([
      getNotices({ page: 0, size: 5 }),
      getGraduationProjects({ page: 0, size: 3 }),
    ])
      .then(([noticePage, projectPage]) => {
        if (cancelled) return
        setNotices(noticePage.content)
        setNoticeTotal(noticePage.totalElements)
        setProjects(projectPage.content)
        setProjectTotal(projectPage.totalElements)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AdminLayout title="관리자 대시보드">
      <p className="admin-page__title">안녕하세요, {getAdminEmail() ?? '관리자'}님</p>
      <p className="admin-page__desc">오늘의 학과 홈페이지 운영 현황을 확인하세요.</p>

      {error && <p className="admin-writer__error" role="alert">{error}</p>}

      <div className="admin-kpis">
        <div className="admin-kpi admin-kpi--pink">
          <p className="admin-kpi__label">게시된 공지사항</p>
          <p className="admin-kpi__value">{noticeTotal}</p>
        </div>
        <div className="admin-kpi">
          <p className="admin-kpi__label">등록된 졸업작품</p>
          <p className="admin-kpi__value">{projectTotal}</p>
        </div>
      </div>

      <div className="admin-card admin-card--notices">
        <div className="admin-card__head">
          <h2>최근 공지사항</h2>
          <Link to="/admin/notices/new" className="admin-btn admin-btn--primary admin-btn--sm">
            공지 작성
          </Link>
        </div>
        <div className="admin-notice-rows">
          {notices.length === 0 && <p className="admin-page__desc">등록된 공지사항이 없습니다.</p>}
          {notices.map((n) => (
            <div className="admin-notice-row" key={n.id}>
              <p>{n.title}</p>
              <span className="admin-notice-row__date">
                {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('ko-KR') : '-'}
              </span>
              <span
                className={
                  n.status === 'PUBLISHED'
                    ? 'admin-notice-row__status admin-notice-row__status--live'
                    : 'admin-notice-row__status admin-notice-row__status--draft'
                }
              >
                {n.status === 'PUBLISHED' ? '게시' : '임시저장'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">최근 졸업작품</h2>
        <div className="admin-project-grid">
          {projects.length === 0 && <p className="admin-page__desc">등록된 졸업작품이 없습니다.</p>}
          {projects.map((p) => (
            <div className="admin-project-card" key={p.id}>
              <p className="admin-project-card__year">{p.year}</p>
              <p className="admin-project-card__title">{p.title}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
