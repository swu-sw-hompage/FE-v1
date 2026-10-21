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
    Promise.all([getNotices({ page: 0, size: 5 }), getGraduationProjects({ page: 0, size: 3 })])
      .then(([noticePage, projectPage]) => {
        if (cancelled) return
        setNotices(noticePage?.content ?? [])
        setNoticeTotal(noticePage?.totalElements ?? 0)
        setProjects(projectPage?.content ?? [])
        setProjectTotal(projectPage?.totalElements ?? 0)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AdminLayout
      breadcrumb="대시보드"
      eyebrow="OVERVIEW"
      title={`안녕하세요, ${getAdminEmail() ?? '관리자'}님`}
      description="오늘의 학과 홈페이지 운영 현황을 확인하세요."
    >
      {error && <p className="admin-writer__error" role="alert">{error}</p>}

      <div className="admin-stats">
        <div className="admin-stat">
          <p className="admin-stat__label">게시된 공지사항</p>
          <p className="admin-stat__value">{noticeTotal}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">등록된 졸업작품</p>
          <p className="admin-stat__value">{projectTotal}</p>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <h2 className="admin-form-card__title" style={{ margin: 0 }}>
            최근 공지사항
          </h2>
          <Link to="/admin/notices/new" className="admin-btn admin-btn--primary admin-btn--sm">
            공지 작성
          </Link>
        </div>
        <table className="admin-table">
          <tbody>
            {notices.length === 0 && (
              <tr>
                <td className="admin-table__empty">등록된 공지사항이 없습니다.</td>
              </tr>
            )}
            {notices.map((n) => (
              <tr key={n.id}>
                <td className="admin-table__title">{n.title}</td>
                <td className="admin-table__muted" style={{ width: 120 }}>
                  {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('ko-KR') : '-'}
                </td>
                <td style={{ width: 90 }}>
                  <span
                    className={
                      n.status === 'PUBLISHED' ? 'admin-badge admin-badge--green' : 'admin-badge admin-badge--gray'
                    }
                  >
                    {n.status === 'PUBLISHED' ? '게시' : '임시저장'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <h2 className="admin-form-card__title" style={{ margin: 0 }}>
            최근 졸업작품
          </h2>
          <Link to="/admin/capstone/new" className="admin-btn admin-btn--primary admin-btn--sm">
            작품 등록
          </Link>
        </div>
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
