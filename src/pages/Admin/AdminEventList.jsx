import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import ConfirmModal from '../../components/admin/ConfirmModal'
import AdminToast from '../../components/admin/AdminToast'
import { getAdminDepartmentEvents, deleteDepartmentEvent, formatEventDate } from '../../api/event'
import { getPageWindow } from '../../utils/pagination'
import './Admin.css'

const PAGE_SIZE = 10

// 학과 행사 관리 — 임시저장·게시 글을 한 목록에서 행사 날짜 최신순으로 본다 (1년에 몇 건이라 탭은 따로 안 나눔).
export default function AdminEventList() {
  const location = useLocation()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [events, setEvents] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(location.state?.toast ?? '')
  const [reloadKey, setReloadKey] = useState(0)

  // 작성 화면에서 넘어온 토스트는 한 번만 보여주고, 새로고침해도 다시 뜨지 않게 state를 비운다.
  useEffect(() => {
    if (location.state?.toast) navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getAdminDepartmentEvents({ page: page - 1, size: PAGE_SIZE })
      .then((result) => {
        if (cancelled) return
        setEvents(result.content)
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
  }, [page, reloadKey])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteDepartmentEvent(deleteTarget.id)
      setDeleteTarget(null)
      setToast('행사가 삭제되었습니다.')
      // 마지막 한 건을 지운 페이지면 앞 페이지로
      if (events.length === 1 && page > 1) setPage((p) => p - 1)
      else setReloadKey((k) => k + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout
      breadcrumb="학과 행사"
      eyebrow="DEPARTMENT EVENTS"
      title="학과 행사 관리"
      description="시상식·전시회·특강 같은 학과 행사를 사진과 함께 올립니다. 게시하면 홈 상단에 7일 동안 알림 띠가 뜹니다."
      headActions={
        <Link to="/admin/events/new" className="admin-btn admin-btn--primary">
          + 행사 등록
        </Link>
      }
    >
      <div className="admin-table-card">
        {error && (
          <p className="admin-writer__error" role="alert">
            {error}
          </p>
        )}

        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 72 }}>사진</th>
              <th>행사명</th>
              <th style={{ width: 120 }}>행사 날짜</th>
              <th style={{ width: 80 }}>사진 수</th>
              <th style={{ width: 110 }}>상태</th>
              <th style={{ width: 140 }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="admin-table__empty">
                  불러오는 중...
                </td>
              </tr>
            )}
            {!loading && events.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-table__empty">
                  등록된 학과 행사가 없습니다.
                </td>
              </tr>
            )}
            {!loading &&
              events.map((event) => {
                const published = event.status === 'PUBLISHED'
                return (
                  <tr key={event.id}>
                    <td>
                      {event.photos[0] ? (
                        <img className="admin-event__thumb" src={event.photos[0]} alt="" />
                      ) : (
                        <span className="admin-event__thumb admin-event__thumb--empty" aria-hidden="true" />
                      )}
                    </td>
                    <td className="admin-table__title">
                      {published ? (
                        <Link
                          to={`/activities/events/${event.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-table__link"
                        >
                          {event.title}
                        </Link>
                      ) : (
                        event.title
                      )}
                    </td>
                    <td className="admin-table__muted">{formatEventDate(event.date)}</td>
                    <td className="admin-table__muted">{event.photos.length}장</td>
                    <td>
                      <span className={published ? 'admin-badge admin-badge--green' : 'admin-badge admin-badge--gray'}>
                        {published ? '게시중' : '임시저장'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <Link to={`/admin/events/${event.id}/edit`} className="admin-table__btn">
                          수정
                        </Link>
                        <button
                          type="button"
                          className="admin-table__btn admin-table__btn--danger"
                          onClick={() => setDeleteTarget(event)}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
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
        title="행사를 삭제할까요?"
        description={deleteTarget ? `"${deleteTarget.title}" 행사와 사진 목록이 영구적으로 삭제됩니다.` : ''}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <AdminToast message={toast} onClose={() => setToast('')} />
    </AdminLayout>
  )
}
