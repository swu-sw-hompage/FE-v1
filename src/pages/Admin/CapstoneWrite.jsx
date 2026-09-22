import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import { createGraduationProject } from '../../api/graduation'
import './Admin.css'

export default function CapstoneWrite() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('published')
  const [year, setYear] = useState('')
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [desc, setDesc] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (targetStatus) => {
    if (!year.trim() || !title.trim() || !desc.trim()) {
      setError('졸업연도, 작품명, 상세 설명을 입력해주세요.')
      return
    }
    setError('')
    setStatus(targetStatus)
    setSubmitting(true)
    try {
      await createGraduationProject({
        year: Number(year),
        title,
        summary,
        content: desc,
        thumbnailUrl: null,
        status: targetStatus === 'published' ? 'PUBLISHED' : 'DRAFT',
      })
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout title="졸업프로젝트 작성">
      <div className="admin-writer">
        <p className="admin-writer__eyebrow">PROJECT ARCHIVE</p>
        <h2 className="admin-writer__title">졸업프로젝트 작성</h2>
        <p className="admin-writer__desc">연도별 졸업작품 정보를 등록하고 학생활동 페이지에 공개할 수 있습니다.</p>

        <div className="admin-writer__row">
          <form
            className="admin-writer__form"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <h3>프로젝트 기본 정보</h3>

            <label className="admin-field">
              <span>졸업연도</span>
              <input
                type="text"
                placeholder="연도를 선택해주세요"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </label>

            <label className="admin-field">
              <span>작품명</span>
              <input
                type="text"
                placeholder="작품명을 입력해주세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="admin-field">
              <span>한 줄 소개</span>
              <input
                type="text"
                placeholder="프로젝트를 한 문장으로 소개해주세요"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </label>

            <label className="admin-field">
              <span>썸네일</span>
              <div className="admin-upload">대표 이미지를 업로드해주세요 · JPG, PNG</div>
            </label>

            <label className="admin-field">
              <span>상세 설명</span>
              <textarea
                placeholder="프로젝트의 배경, 문제 정의, 해결 과정과 결과를 입력해주세요"
                rows={7}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </label>

            <div className="admin-field admin-field--row">
              <span>게시 상태</span>
              <button
                type="button"
                className={status === 'draft' ? 'admin-state admin-state--active' : 'admin-state'}
                onClick={() => setStatus('draft')}
              >
                임시저장
              </button>
              <button
                type="button"
                className={status === 'published' ? 'admin-state admin-state--active' : 'admin-state'}
                onClick={() => setStatus('published')}
              >
                게시
              </button>
            </div>
          </form>

          <aside className="admin-writer__panel admin-writer__panel--yellow">
            <h3>작품 등록 안내</h3>
            <div className="admin-info-row">
              <p className="admin-info-row__label">현재 등록 연도</p>
              <p className="admin-info-row__value">2025 졸업프로젝트</p>
            </div>
            <div className="admin-note admin-note--yellow">
              <p>공개된 작품은 학생활동 페이지의 졸업프로젝트 아카이브에 표시됩니다.</p>
              <p>필수 항목을 모두 입력한 뒤 게시해주세요.</p>
            </div>
            <Link to="/activities/2025" className="admin-preview-link">
              학생활동에서 미리보기
            </Link>
          </aside>
        </div>

        {error && <p className="admin-writer__error" role="alert">{error}</p>}

        <div className="admin-writer__actions">
          <Link to="/admin" className="admin-btn admin-btn--ghost">
            취소
          </Link>
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            disabled={submitting}
            onClick={() => handleSubmit('draft')}
          >
            임시저장
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            disabled={submitting}
            onClick={() => handleSubmit('published')}
          >
            게시하기
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
