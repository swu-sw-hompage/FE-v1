import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import MarkdownLite from '../../components/common/MarkdownLite'
import {
  createNotice,
  updateNotice,
  publishNotice,
  getNoticeById,
  getAdminNotices,
} from '../../api/notice'
import { getAdminEmail } from '../../api/auth'
import './Admin.css'

const COLOR_SWATCHES = ['#7b1e22', '#1f5fd6', '#1f9d55', '#c0392b', '#7a7a80']

export default function NoticeWrite() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [category, setCategory] = useState('academic')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [previewMode, setPreviewMode] = useState(false)
  const [files, setFiles] = useState([])
  const [publishMode, setPublishMode] = useState('now')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('09:00')
  const [createdAt, setCreatedAt] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isEdit) return undefined
    let cancelled = false
    getNoticeById(id)
      .then((notice) => {
        if (cancelled || !notice) return
        applyNotice(notice)
      })
      .catch(() =>
        // 공개 조회는 게시된 공지만 내려주므로, 임시저장 글은 관리자 목록에서 찾아온다
        getAdminNotices({ size: 100 })
          .then((result) => {
            if (cancelled) return
            const found = (result?.content ?? []).find((n) => String(n.id) === String(id))
            if (found) applyNotice(found)
            else setError('공지사항을 불러오지 못했습니다.')
          })
          .catch((err) => {
            if (!cancelled) setError(err.message)
          }),
      )
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    function applyNotice(notice) {
      setTitle(notice.title ?? '')
      setBody(notice.content ?? '')
      setCategory(notice.employmentNotice ? 'career' : 'academic')
      setCreatedAt(notice.createdAt ?? null)
    }

    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  const addFiles = (fileList) => {
    setFiles((prev) => [...prev, ...Array.from(fileList)])
  }

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

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

  const scheduledAt =
    publishMode === 'scheduled' && scheduleDate ? `${scheduleDate}T${scheduleTime}:00` : null

  const handleSubmit = async (targetStatus) => {
    if (!title.trim() || !body.trim()) {
      setError('제목과 내용을 입력해주세요.')
      return
    }
    if (targetStatus === 'published' && publishMode === 'scheduled' && !scheduleDate) {
      setError('예약 게시 일시를 선택해주세요.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        title,
        content: body,
        academicNotice: category === 'academic',
        employmentNotice: category === 'career',
        ...(scheduledAt ? { scheduledAt } : {}),
      }
      const notice = isEdit ? await updateNotice(id, payload, files) : await createNotice(payload, files)
      if (targetStatus === 'published' && publishMode === 'now') {
        await publishNotice(notice?.id ?? id)
      }
      navigate('/admin/notices')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout breadcrumb="공지사항 작성" eyebrow="NOTICE MANAGEMENT" title={isEdit ? '공지사항 수정' : '공지사항 작성'}>
        <p className="admin-page__desc">불러오는 중...</p>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      breadcrumb={isEdit ? '공지사항 수정' : '공지사항 작성'}
      eyebrow="NOTICE MANAGEMENT"
      title={isEdit ? '공지사항 수정' : '공지사항 작성'}
      description="학과 구성원에게 전달할 공지사항을 작성하고 게시할 수 있습니다."
    >
      <div className="admin-columns">
        <form
          className="admin-form-card"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <h2 className="admin-form-card__title">공지사항 내용</h2>

          <div className="admin-form-row">
            <label className="admin-field admin-field--sm">
              <span>
                분류<em>*</em>
              </span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="academic">학사</option>
                <option value="career">취업</option>
              </select>
            </label>
            <label className="admin-field admin-field--grow">
              <span>
                제목<em>*</em>
              </span>
              <input
                type="text"
                placeholder="제목을 입력해주세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>

          <label className="admin-field">
            <span>
              내용<em>*</em>
            </span>
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
                <MarkdownLite text={body || '미리볼 내용이 없습니다.'} className="admin-editor__preview" />
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

          <label className="admin-field">
            <span>
              첨부파일<em className="admin-field__optional">선택</em>
            </span>
            <div className="admin-attachments">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={(e) => {
                  addFiles(e.target.files)
                  e.target.value = ''
                }}
              />
              <button type="button" className="admin-btn admin-btn--outline" onClick={() => fileInputRef.current?.click()}>
                파일 선택
              </button>
              {files.length > 0 && (
                <ul className="admin-attachments__list">
                  {files.map((file, index) => (
                    <li key={`${file.name}-${index}`}>
                      <span>{file.name}</span>
                      <button type="button" onClick={() => removeFile(index)} aria-label="첨부파일 삭제">
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </label>

          <label className="admin-field">
            <span>
              게시 방식<em>*</em>
            </span>
            <div className="admin-radio-group">
              <label className="admin-radio">
                <input
                  type="radio"
                  checked={publishMode === 'now'}
                  onChange={() => setPublishMode('now')}
                />
                즉시 게시
              </label>
              <label className="admin-radio">
                <input
                  type="radio"
                  checked={publishMode === 'scheduled'}
                  onChange={() => setPublishMode('scheduled')}
                />
                예약 게시
              </label>
            </div>
            {publishMode === 'scheduled' && (
              <div className="admin-schedule">
                <p className="admin-schedule__label">게시 일시</p>
                <div className="admin-schedule__pickers">
                  <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                  <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                </div>
                <p className="admin-schedule__note">
                  설정한 시간에 자동으로 게시되고, 알림 신청자에게 메일도 그때 발송됩니다.
                </p>
              </div>
            )}
          </label>

          <div className="admin-divider" />

          <div className="admin-form-actions">
            <Link to="/admin/notices" className="admin-btn admin-btn--ghost">
              취소
            </Link>
            <div className="admin-form-actions__right">
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
                {publishMode === 'scheduled' ? '예약하기' : '게시하기'}
              </button>
            </div>
          </div>

          {error && (
            <p className="admin-writer__error" role="alert">
              {error}
            </p>
          )}
        </form>

        <aside className="admin-info-card">
          <h2 className="admin-info-card__title">게시 정보</h2>
          <div className="admin-info-row admin-info-row--bordered">
            <p className="admin-info-row__label">작성자</p>
            <p className="admin-info-row__value">{getAdminEmail() ?? '관리자'}</p>
          </div>
          <div className="admin-info-row admin-info-row--bordered">
            <p className="admin-info-row__label">작성일</p>
            <p className="admin-info-row__value">
              {createdAt ? new Date(createdAt).toLocaleDateString('ko-KR') : new Date().toLocaleDateString('ko-KR')}
            </p>
          </div>
          {publishMode === 'scheduled' && scheduleDate && (
            <div className="admin-info-row admin-info-row--bordered">
              <p className="admin-info-row__label">게시 예정</p>
              <p className="admin-info-row__value admin-info-row__value--accent">
                {scheduleDate} {scheduleTime}
              </p>
            </div>
          )}
          <div className="admin-callout">
            <span className="admin-callout__icon">i</span>
            <p>공지가 게시되는 시점(예약 시 예약 시간)에 알림 신청자에게 이메일이 발송됩니다.</p>
          </div>
        </aside>
      </div>
    </AdminLayout>
  )
}
