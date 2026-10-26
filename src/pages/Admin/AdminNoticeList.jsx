import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import ConfirmModal from '../../components/admin/ConfirmModal'
import AdminToast from '../../components/admin/AdminToast'
import {
  getAdminNotices,
  deleteNotice,
  noticeCategoryLabel,
  formatNoticeDate,
  formatScheduleTime,
} from '../../api/notice'
import './Admin.css'

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'academic', label: '학사' },
  { key: 'employment', label: '취업' },
]

// 임시저장은 분류가 아니라 게시 상태라 분류 탭과 떨어진 별도 묶음으로 보여준다.
const DRAFT_FILTER = { key: 'draft', label: '임시저장' }

const PAGE_SIZE = 10

export default function AdminNoticeList() {
  const [filter, setFilter] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [submittedKeyword, setSubmittedKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [notices, setNotices] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState('')
  const isDraftTab = filter === 'draft'

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    // 전체/학사/취업은 게시된 공지, 임시저장 탭은 아직 게시하지 않은 글(최근 수정순)을 보여준다.
    getAdminNotices({
      status: isDraftTab ? 'DRAFT' : 'PUBLISHED',
      academic: filter === 'academic' ? true : undefined,
      employment: filter === 'employment' ? true : undefined,
      keyword: submittedKeyword,
      page: page - 1,
      size: PAGE_SIZE,
    })
      .then((result) => {
        if (cancelled) return
        setNotices(result?.content ?? [])
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
  }, [filter, isDraftTab, submittedKeyword, page])

  const runSearch = () => {
    setSubmittedKeyword(keyword.trim())
    setPage(1)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteNotice(deleteTarget.id)
      setNotices((prev) => prev.filter((n) => n.id !== deleteTarget.id))
      setToast('공지사항이 삭제되었습니다.')
      setDeleteTarget(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout
      breadcrumb="공지사항"
      eyebrow="NOTICE MANAGEMENT"
      title="공지사항 관리"
      description="게시된 공지사항과 임시저장한 글을 확인하고 관리할 수 있습니다."
      headActions={
        <Link to="/admin/notices/new" className="admin-btn admin-btn--primary">
          + 공지 작성
        </Link>
      }
    >
      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div className="admin-pill-filter-group">
            {[FILTERS, [DRAFT_FILTER]].map((group) => (
              <div key={group[0].key} className="admin-pill-filter">
                {group.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className={
                      filter === f.key ? 'admin-pill-filter__btn admin-pill-filter__btn--active' : 'admin-pill-filter__btn'
                    }
                    onClick={() => {
                      setFilter(f.key)
                      setPage(1)
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="admin-search">
            <input
              type="text"
              placeholder="제목으로 검색하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            />
            <button type="button" className="admin-btn admin-btn--outline" onClick={runSearch}>
              검색
            </button>
          </div>
        </div>

        {error && <p className="admin-writer__error" role="alert">{error}</p>}

        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 96 }}>분류</th>
              <th>제목</th>
              <th style={{ width: 110 }}>상태</th>
              <th style={{ width: 120 }}>{isDraftTab ? '최근 수정' : '작성일'}</th>
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
            {!loading && notices.length === 0 && (
              <tr>
                <td colSpan={5} className="admin-table__empty">
                  {isDraftTab ? '임시저장한 글이 없습니다.' : '등록된 공지사항이 없습니다.'}
                </td>
              </tr>
            )}
            {!loading &&
              notices.map((notice) => (
                <tr key={notice.id}>
                  <td>
                    <span
                      className={
                        notice.employmentNotice ? 'admin-badge admin-badge--gray' : 'admin-badge admin-badge--pink'
                      }
                    >
                      {noticeCategoryLabel(notice)}
                    </span>
                  </td>
                  <td className="admin-table__title">{notice.title}</td>
                  <td>
                    <span
                      className={
                        notice.status === 'PUBLISHED'
                          ? 'admin-badge admin-badge--green'
                          : 'admin-badge admin-badge--gray'
                      }
                    >
                      {notice.status === 'PUBLISHED' ? '게시중' : notice.scheduledAt ? '예약' : '임시저장'}
                    </span>
                    {notice.status === 'DRAFT' && notice.scheduledAt && (
                      <p className="admin-table__sub">{formatScheduleTime(notice.scheduledAt)}</p>
                    )}
                  </td>
                  <td className="admin-table__muted">
                    {formatNoticeDate(
                      notice.status === 'DRAFT' ? notice.updatedAt : (notice.publishedAt ?? notice.createdAt),
                    )}
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <Link to={`/admin/notices/${notice.id}/edit`} className="admin-table__btn">
                        수정
                      </Link>
                      <button
                        type="button"
                        className="admin-table__btn admin-table__btn--danger"
                        onClick={() => setDeleteTarget(notice)}
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={n === page ? 'is-active' : ''}
                onClick={() => setPage(n)}
              >
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
        title="공지사항을 삭제할까요?"
        description={deleteTarget ? `"${deleteTarget.title}" 공지사항이 영구적으로 삭제됩니다.` : ''}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <AdminToast message={toast} onClose={() => setToast('')} />
    </AdminLayout>
  )
}
