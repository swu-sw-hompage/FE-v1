import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import ConfirmModal from '../../components/admin/ConfirmModal'
import AdminToast from '../../components/admin/AdminToast'
import { getSubscribers, deleteSubscriber } from '../../api/subscriber'
import './Admin.css'

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'academic', label: '학사' },
  { key: 'employment', label: '취업' },
]

const PAGE_SIZE = 10
// 서버는 keyword 검색만 지원하고 분류 필터/전체 개수 기준 페이지네이션은 지원하지 않아,
// 한 번에 넉넉히 받아와서 분류 필터링과 페이지 계산은 화면에서 처리한다.
const FETCH_SIZE = 1000

const maskEmail = (email) => {
  if (!email) return ''
  const [local, domain] = email.split('@')
  if (!domain) return email
  const visible = local.slice(0, Math.min(3, local.length))
  return `${visible}${'*'.repeat(Math.max(local.length - visible.length, 3))}@${domain}`
}

export default function AdminSubscribers() {
  const [filter, setFilter] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [submittedKeyword, setSubmittedKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [subscribers, setSubscribers] = useState([])
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getSubscribers({ keyword: submittedKeyword, page: 0, size: FETCH_SIZE })
      .then((result) => {
        if (cancelled) return
        setSubscribers(result?.content ?? [])
        setTotalElements(result?.totalElements ?? (result?.content ?? []).length)
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
  }, [submittedKeyword])

  const filtered = useMemo(() => {
    if (filter === 'academic') return subscribers.filter((s) => s.academicNotice)
    if (filter === 'employment') return subscribers.filter((s) => s.employmentNotice)
    return subscribers
  }, [subscribers, filter])

  const stats = useMemo(
    () => ({
      total: totalElements,
      academic: subscribers.filter((s) => s.academicNotice).length,
      employment: subscribers.filter((s) => s.employmentNotice).length,
    }),
    [subscribers, totalElements],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const runSearch = () => {
    setSubmittedKeyword(keyword.trim())
    setPage(1)
  }

  const handleDeleteOne = async () => {
    if (!deleteTarget) return
    try {
      await deleteSubscriber(deleteTarget.id)
      setSubscribers((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      setTotalElements((prev) => Math.max(0, prev - 1))
      setToast('신청자를 삭제했습니다.')
      setDeleteTarget(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const exportCsv = () => {
    const rows = [
      ['email', 'academicNotice', 'employmentNotice', 'createdAt'],
      ...filtered.map((s) => [s.email, s.academicNotice, s.employmentNotice, s.createdAt]),
    ]
    const csv = rows.map((row) => row.map((v) => `"${v ?? ''}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'subscribers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout
      breadcrumb="알림 신청자"
      eyebrow="SUBSCRIBERS"
      title="알림 신청자"
      description="공지 알림을 신청한 이메일 목록입니다. 공지를 게시하면 선택한 분류에 맞춰 메일이 발송됩니다."
      headActions={
        <button type="button" className="admin-btn admin-btn--outline" onClick={exportCsv}>
          CSV 내보내기 ↓
        </button>
      }
    >
      <div className="admin-stats">
        <div className="admin-stat">
          <p className="admin-stat__label">전체 신청자</p>
          <p className="admin-stat__value">
            {stats.total} <span>명</span>
          </p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">학사공지 구독</p>
          <p className="admin-stat__value">
            {stats.academic} <span>명</span>
          </p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">취업공지 구독</p>
          <p className="admin-stat__value">
            {stats.employment} <span>명</span>
          </p>
        </div>
      </div>

      {error && <p className="admin-writer__error" role="alert">{error}</p>}

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div className="admin-pill-filter">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={filter === f.key ? 'admin-pill-filter__btn admin-pill-filter__btn--active' : 'admin-pill-filter__btn'}
                onClick={() => {
                  setFilter(f.key)
                  setPage(1)
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="admin-search">
            <input
              type="text"
              placeholder="이메일로 검색하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            />
            <button type="button" className="admin-btn admin-btn--outline" onClick={runSearch}>
              검색
            </button>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>이메일</th>
              <th style={{ width: 160 }}>구독 공지</th>
              <th style={{ width: 110 }}>신청일</th>
              <th style={{ width: 90, whiteSpace: 'nowrap' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="admin-table__empty">
                  불러오는 중...
                </td>
              </tr>
            )}
            {!loading && pageRows.length === 0 && (
              <tr>
                <td colSpan={4} className="admin-table__empty">
                  신청자가 없습니다.
                </td>
              </tr>
            )}
            {!loading &&
              pageRows.map((s) => (
                <tr key={s.id}>
                  <td>{maskEmail(s.email)}</td>
                  <td>
                    <div className="admin-table__actions">
                      {s.academicNotice && <span className="admin-badge admin-badge--pink">학사</span>}
                      {s.employmentNotice && <span className="admin-badge admin-badge--gray">취업</span>}
                    </div>
                  </td>
                  <td className="admin-table__muted">
                    {s.createdAt ? String(s.createdAt).split(/[ T]/)[0].replaceAll('-', '.') : '-'}
                  </td>
                  <td>
                    <button type="button" className="admin-table__btn" onClick={() => setDeleteTarget(s)}>
                      삭제
                    </button>
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

      <div className="admin-privacy-note">
        이메일은 개인정보 보호를 위해 일부만 표시됩니다. 신청자 이메일은 공지 알림 발송 목적으로만 사용해주세요.
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="신청자를 삭제할까요?"
        description={deleteTarget ? `${maskEmail(deleteTarget.email)} 신청 정보가 삭제됩니다.` : ''}
        onConfirm={handleDeleteOne}
        onCancel={() => setDeleteTarget(null)}
      />
      <AdminToast message={toast} onClose={() => setToast('')} />
    </AdminLayout>
  )
}
