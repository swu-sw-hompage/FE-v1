import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import ConfirmModal from '../../components/admin/ConfirmModal'
import AdminToast from '../../components/admin/AdminToast'
import { getSubscribers, deleteSubscriber, deleteSubscribers } from '../../api/subscriber'
import './Admin.css'

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'academic', label: '학사' },
  { key: 'employment', label: '취업' },
  { key: 'pending', label: '인증 대기' },
]

const PAGE_SIZE = 10

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
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getSubscribers({
      academic: filter === 'academic' ? true : undefined,
      employment: filter === 'employment' ? true : undefined,
      verified: filter === 'pending' ? false : undefined,
      keyword: submittedKeyword,
      page: page - 1,
      size: PAGE_SIZE,
    })
      .then((result) => {
        if (cancelled) return
        setSubscribers(result?.content ?? [])
        setTotalPages(Math.max(1, result?.totalPages ?? 1))
        setTotalElements(result?.totalElements ?? (result?.content ?? []).length)
        setSelected(new Set())
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
  }, [filter, submittedKeyword, page])

  const stats = useMemo(() => {
    const academic = subscribers.filter((s) => s.academicNotice).length
    const employment = subscribers.filter((s) => s.employmentNotice).length
    const pending = subscribers.filter((s) => !s.verified).length
    return { total: totalElements, academic, employment, pending }
  }, [subscribers, totalElements])

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    setSelected((prev) => (prev.size === subscribers.length ? new Set() : new Set(subscribers.map((s) => s.id))))
  }

  const runSearch = () => {
    setSubmittedKeyword(keyword.trim())
    setPage(1)
  }

  const handleDeleteOne = async () => {
    if (!deleteTarget) return
    try {
      await deleteSubscriber(deleteTarget.id)
      setSubscribers((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      setToast('신청자를 삭제했습니다.')
      setDeleteTarget(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleBulkDelete = async () => {
    setBulkDeleting(true)
    try {
      await deleteSubscribers(Array.from(selected))
      setSubscribers((prev) => prev.filter((s) => !selected.has(s.id)))
      setToast(`${selected.size}명을 삭제했습니다.`)
      setSelected(new Set())
    } catch (err) {
      setError(err.message)
    } finally {
      setBulkDeleting(false)
    }
  }

  const exportCsv = () => {
    const rows = [
      ['email', 'academicNotice', 'employmentNotice', 'verified', 'createdAt'],
      ...subscribers.map((s) => [s.email, s.academicNotice, s.employmentNotice, s.verified, s.createdAt]),
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
        <div className="admin-stat">
          <p className="admin-stat__label">인증 대기</p>
          <p className="admin-stat__value admin-stat__value--warn">
            {stats.pending} <span>명</span>
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

        {selected.size > 0 && (
          <div className="admin-bulk-bar">
            <p>{selected.size}명 선택됨</p>
            <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={handleBulkDelete} disabled={bulkDeleting}>
              선택 삭제
            </button>
          </div>
        )}

        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  checked={subscribers.length > 0 && selected.size === subscribers.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>이메일</th>
              <th style={{ width: 160 }}>구독 공지</th>
              <th style={{ width: 110 }}>인증 상태</th>
              <th style={{ width: 110 }}>신청일</th>
              <th style={{ width: 90, whiteSpace: 'nowrap' }}>관리</th>
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
            {!loading && subscribers.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-table__empty">
                  신청자가 없습니다.
                </td>
              </tr>
            )}
            {!loading &&
              subscribers.map((s) => (
                <tr key={s.id}>
                  <td>
                    <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} />
                  </td>
                  <td>{maskEmail(s.email)}</td>
                  <td>
                    <div className="admin-table__actions">
                      {s.academicNotice && <span className="admin-badge admin-badge--pink">학사</span>}
                      {s.employmentNotice && <span className="admin-badge admin-badge--gray">취업</span>}
                    </div>
                  </td>
                  <td>
                    <span className={s.verified ? 'admin-badge admin-badge--green' : 'admin-badge admin-badge--warn'}>
                      {s.verified ? '인증 완료' : '인증 대기'}
                    </span>
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
