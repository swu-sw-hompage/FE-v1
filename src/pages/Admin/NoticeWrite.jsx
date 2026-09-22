import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import MarkdownLite from '../../components/common/MarkdownLite'
import { createNotice, publishNotice } from '../../api/notice'
import { getAdminEmail } from '../../api/auth'
import './Admin.css'

const COLOR_SWATCHES = ['#7b1e22', '#1f5fd6', '#1f9d55', '#c0392b', '#7a7a80']

export default function NoticeWrite() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('general')
  const [status, setStatus] = useState('published')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [previewMode, setPreviewMode] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef(null)

  const wrapSelection = (before, after = before) => {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart, selectionEnd, value } = el
    const selected = value.slice(selectionStart, selectionEnd) || '텍스트'
    const next = value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd)
    setBody(next)
    requestAnimationFrame(() => {
      el.focus()
      el.selectionStart = selectionStart + before.length
      el.selectionEnd = selectionStart + before.length + selected.length
    })
  }

  const applyColor = (hex) => wrapSelection(`{color:${hex}}`, '{/color}')

  const handleSubmit = async (targetStatus) => {
    if (!title.trim() || !body.trim()) {
      setError('제목과 내용을 입력해주세요.')
      return
    }
    setError('')
    setStatus(targetStatus)
    setSubmitting(true)
    try {
      const notice = await createNotice({
        title,
        content: body,
        academicNotice: category === 'general',
        employmentNotice: category === 'career',
      })
      if (targetStatus === 'published') {
        await publishNotice(notice.id)
      }
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout title="공지사항 작성">
      <div className="admin-writer">
        <p className="admin-writer__eyebrow">NOTICE MANAGEMENT</p>
        <h2 className="admin-writer__title">공지사항 작성</h2>
        <p className="admin-writer__desc">학과 구성원에게 전달할 공지사항을 작성하고 게시할 수 있습니다.</p>

        <div className="admin-writer__row">
          <form
            className="admin-writer__form"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <h3>공지사항 내용</h3>

            <label className="admin-field">
              <span>분류</span>
              <div className="admin-segmented">
                <button
                  type="button"
                  className={category === 'general' ? 'admin-segmented__btn admin-segmented__btn--active' : 'admin-segmented__btn'}
                  onClick={() => setCategory('general')}
                >
                  일반공지
                </button>
                <button
                  type="button"
                  className={category === 'career' ? 'admin-segmented__btn admin-segmented__btn--active' : 'admin-segmented__btn'}
                  onClick={() => setCategory('career')}
                >
                  취업공지
                </button>
              </div>
            </label>

            <label className="admin-field">
              <span>제목</span>
              <input
                type="text"
                placeholder="제목을 입력해주세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="admin-field">
              <span>내용</span>
              <div className="admin-editor">
                <div className="admin-editor__toolbar">
                  <button
                    type="button"
                    className="admin-editor__btn admin-editor__btn--bold"
                    onClick={() => wrapSelection('**')}
                    title="굵게"
                    disabled={previewMode}
                  >
                    B
                  </button>
                  <button
                    type="button"
                    className="admin-editor__btn admin-editor__btn--italic"
                    onClick={() => wrapSelection('*')}
                    title="기울임"
                    disabled={previewMode}
                  >
                    I
                  </button>
                  <button
                    type="button"
                    className="admin-editor__btn admin-editor__btn--strike"
                    onClick={() => wrapSelection('~~')}
                    title="취소선"
                    disabled={previewMode}
                  >
                    S
                  </button>
                  <span className="admin-editor__divider" />
                  {COLOR_SWATCHES.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      className="admin-editor__swatch"
                      style={{ background: hex }}
                      title={hex}
                      onClick={() => applyColor(hex)}
                      disabled={previewMode}
                    />
                  ))}
                  <input
                    type="color"
                    className="admin-editor__color-input"
                    onChange={(e) => applyColor(e.target.value)}
                    title="색상 직접 선택"
                    disabled={previewMode}
                  />
                  <span className="admin-editor__spacer" />
                  <div className="admin-editor__tabs">
                    <button
                      type="button"
                      className={!previewMode ? 'admin-editor__tab admin-editor__tab--active' : 'admin-editor__tab'}
                      onClick={() => setPreviewMode(false)}
                    >
                      작성
                    </button>
                    <button
                      type="button"
                      className={previewMode ? 'admin-editor__tab admin-editor__tab--active' : 'admin-editor__tab'}
                      onClick={() => setPreviewMode(true)}
                    >
                      미리보기
                    </button>
                  </div>
                </div>
                {previewMode ? (
                  <MarkdownLite
                    text={body || '미리볼 내용이 없습니다.'}
                    className="admin-editor__preview"
                  />
                ) : (
                  <textarea
                    ref={textareaRef}
                    placeholder="공지사항 내용을 입력해주세요"
                    rows={10}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                )}
              </div>
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

          <aside className="admin-writer__panel admin-writer__panel--blue">
            <h3>게시 정보</h3>
            <div className="admin-info-row">
              <p className="admin-info-row__label">작성자</p>
              <p className="admin-info-row__value">{getAdminEmail() ?? '관리자'}</p>
            </div>
            <div className="admin-info-row">
              <p className="admin-info-row__label">작성일</p>
              <p className="admin-info-row__value">{new Date().toLocaleDateString('ko-KR')}</p>
            </div>
            <div className="admin-note admin-note--blue">
              게시된 공지는 알림 신청자에게 이메일로 발송됩니다.
            </div>
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
