import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import ConfirmModal from '../../components/admin/ConfirmModal'
import AdminToast from '../../components/admin/AdminToast'
import { getGraduationProjects, deleteGraduationProject } from '../../api/graduation'
import { ACTIVITY_YEARS } from '../../constants/activities'
import './Admin.css'
import { getPageWindow } from '../../utils/pagination'

const PAGE_SIZE = 10

export default function AdminCapstoneList() {
  const [year, setYear] = useState('all')
  const [page, setPage] = useState(1)
  const [projects, setProjects] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    // 관리자 전용 목록 조회 API가 없어 게시된 작품만 내려주는 공개 엔드포인트를 사용한다
    // (임시저장 작품은 이 목록에 나타나지 않는다).
    getGraduationProjects({
      year: year === 'all' ? undefined : Number(year),
      page: page - 1,
      size: PAGE_SIZE,
    })
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
  }, [year, page])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteGraduationProject(deleteTarget.id)
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setToast('졸업프로젝트가 삭제되었습니다.')
      setDeleteTarget(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout
      breadcrumb="졸업프로젝트"
      eyebrow="PROJECT ARCHIVE"
      title="졸업프로젝트 관리"
      description="연도별 졸업작품을 확인하고 게시 상태를 관리할 수 있습니다."
      headActions={
        <Link to="/admin/capstone/new" className="admin-btn admin-btn--primary">
          + 작품 등록
        </Link>
      }
    >
      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <select
            className="admin-year-select"
            value={year}
            onChange={(e) => {
              setYear(e.target.value)
              setPage(1)
            }}
          >
            <option value="all">전체 연도</option>
            {ACTIVITY_YEARS.map((y) => (
              <option key={y} value={String(y)}>
                {y}년
              </option>
            ))}
          </select>
        </div>

        {error && <p className="admin-writer__error" role="alert">{error}</p>}

        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 90 }}>연도</th>
              <th>작품명</th>
              <th style={{ width: 160 }}>팀명</th>
              <th style={{ width: 110 }}>상태</th>
              <th style={{ width: 140 }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="admin-table__empty">
                  불러오는 중...
                </td>
              </tr>
            )}
            {!loading && projects.length === 0 && (
              <tr>
                <td colSpan={5} className="admin-table__empty">
                  등록된 졸업프로젝트가 없습니다.
                </td>
              </tr>
            )}
            {!loading &&
              projects.map((project) => (
                <tr key={project.id}>
                  <td className="admin-table__muted">{project.year}</td>
                  <td className="admin-table__title">{project.title}</td>
                  <td className="admin-table__muted">{project.teamName ?? '-'}</td>
                  <td>
                    <span
                      className={
                        project.status === 'PUBLISHED'
                          ? 'admin-badge admin-badge--green'
                          : 'admin-badge admin-badge--gray'
                      }
                    >
                      {project.status === 'PUBLISHED' ? '게시중' : '임시저장'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <Link to={`/admin/capstone/${project.id}/edit`} className="admin-table__btn">
                        수정
                      </Link>
                      <button
                        type="button"
                        className="admin-table__btn admin-table__btn--danger"
                        onClick={() => setDeleteTarget(project)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="admin-pagination">
            <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              ‹
            </button>
            {getPageWindow(page, totalPages).map((n) => (
              <button key={n} type="button" className={n === page ? 'is-active' : ''} onClick={() => setPage(n)}>
                {n}
              </button>
            ))}
            <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              ›
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="졸업프로젝트를 삭제할까요?"
        description={deleteTarget ? `"${deleteTarget.title}" 작품이 영구적으로 삭제됩니다.` : ''}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <AdminToast message={toast} onClose={() => setToast('')} />
    </AdminLayout>
  )
}
