import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import MarkdownLite from '../../components/common/MarkdownLite'
import { createNotice, updateNotice, publishNotice, getNoticeById, uploadAttachment } from '../../api/notice'
import { getAdminEmail } from '../../api/auth'
import './Admin.css'

const COLOR_SWATCHES = ['#7b1e22', '#1f5fd6', '#1f9d55', '#c0392b', '#7a7a80']

export default function NoticeWrite() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [category, setCategory] = useState('academic')
  const [pinned, setPinned] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [previewMode, setPreviewMode] = useState(false)
  const [attachments, setAttachments] = useState([])
  const [attachmentName, setAttachmentName] = useState('')
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
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
        setTitle(notice.title ?? '')
        setBody(notice.content ?? '')
        setCategory(notice.employmentNotice ? 'career' : 'academic')
        setPinned(Boolean(notice.pinned))
        setCreatedAt(notice.createdAt ?? null)
        setAttachments(notice.attachments ?? [])
      })
      .catch(() => {
        // 공개 조회는 게시된 공지만 내려준다 — 임시저장 글은 다시 불러올 방법이 없다.
        if (!cancelled) setError('공지사항을 불러오지 못했습니다. 게시되지 않은 글은 다시 불러올 수 없습니다.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  const addAttachment = () => {
    if (!attachmentName.trim() || !attachmentUrl.trim()) return
    setAttachments((prev) => [...prev, { name: attachmentName.trim(), url: attachmentUrl.trim() }])
    setAttachmentName('')
    setAttachmentUrl('')
  }

  const uploadFiles = async (fileList) => {
    const files = Array.from(fileList ?? [])
    if (files.length === 0) return
    setUploading(true)
    setError('')
    try {
      for (const file of files) {
        const uploaded = await uploadAttachment(file)
        setAttachments((prev) => [...prev, { name: uploaded.name, url: uploaded.url }])
      }
    } catch (err) {
      setError(`첨부파일 업로드에 실패했습니다: ${err.message}`)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
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

  // 커서가 있는 줄 맨 앞에 "## " / "### "를 붙인다. 같은 단계를 다시 누르면 제목을 해제한다.
  const toggleHeading = (level) => {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart, selectionEnd, value } = el
    const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
    const lineEndIndex = value.indexOf('\n', selectionStart)
    const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex
    const line = value.slice(lineStart, lineEnd)
    const current = line.match(/^(#{1,6})\s+/)
    const marker = `${'#'.repeat(level)} `
    const stripped = current ? line.slice(current[0].length) : line
    const nextLine = current && current[1].length === level ? stripped : marker + stripped
    const delta = nextLine.length - line.length
    setBody(value.slice(0, lineStart) + nextLine + value.slice(lineEnd))
    requestAnimationFrame(() => {
      el.focus()
      el.selectionStart = Math.max(lineStart, selectionStart + delta)
      el.selectionEnd = Math.max(lineStart, selectionEnd + delta)
    })
  }

  const handleSubmit = async (targetStatus) => {
    if (!title.trim() || !body.trim()) {
      setError('제목과 내용을 입력해주세요.')
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
        // 백엔드는 값이 없으면 고정 해제로 저장하므로 수정 시에도 항상 보낸다.
        pinned,
        attachments,
      }
      const notice = isEdit ? await updateNotice(id, payload) : await createNotice(payload)
      if (targetStatus === 'published') {
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
            <div className="admin-field admin-field--xs">
              <span>상단 고정</span>
              <label className="admin-pin-toggle">
                <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
                목록 맨 위에 고정
              </label>
            </div>
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
                  className="admin-editor__btn admin-editor__btn--heading"
                  onClick={() => toggleHeading(2)}
                  title="제목 (## )"
                  disabled={previewMode}
                >
                  H2
                </button>
                <button
                  type="button"
                  className="admin-editor__btn admin-editor__btn--heading"
                  onClick={() => toggleHeading(3)}
                  title="소제목 (### )"
                  disabled={previewMode}
                >
                  H3
                </button>
                <span className="admin-editor__divider" />
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
                <button
                  type="button"
                  className="admin-editor__btn admin-editor__btn--underline"
                  onClick={() => wrapSelection('__')}
                  title="밑줄 (__텍스트__)"
                  disabled={previewMode}
                >
                  U
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

          {/* label로 감싸면 영역 아무 데나 눌러도 첫 입력칸이 반응해서 div로 둔다 */}
          <div className="admin-field">
            <span>
              첨부파일<em className="admin-field__optional">선택</em>
            </span>
            <div className="admin-attachments">
              <button
                type="button"
                className={`admin-upload admin-upload--compact${dragOver ? ' admin-upload--active' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOver(false)
                  uploadFiles(e.dataTransfer.files)
                }}
                disabled={uploading}
              >
                <span className="admin-upload__icon">+</span>
                <span className="admin-upload__text">
                  {uploading ? '업로드 중...' : '파일을 끌어다 놓거나 클릭해서 선택하세요'}
                </span>
                <span className="admin-upload__hint">PDF, HWP, 한글/오피스 문서, 이미지, ZIP · 파일당 최대 30MB</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={(e) => uploadFiles(e.target.files)}
              />
              <p className="admin-attachments__or">또는 외부 링크로 추가</p>
              <div className="admin-form-row admin-attachments__link-row">
                <div className="admin-field admin-field--grow">
                  <input
                    type="text"
                    placeholder="파일명 (예: 신청서 양식.pdf)"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                  />
                </div>
                <div className="admin-field admin-field--grow">
                  <input
                    type="text"
                    placeholder="파일 URL"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                  />
                </div>
                <button type="button" className="admin-btn admin-btn--outline" onClick={addAttachment}>
                  추가
                </button>
              </div>
              {attachments.length > 0 && (
                <ul className="admin-attachments__list">
                  {attachments.map((file, index) => (
                    <li key={`${file.name}-${index}`}>
                      <a href={file.url} target="_blank" rel="noopener noreferrer">
                        {file.name}
                      </a>
                      <button type="button" onClick={() => removeAttachment(index)} aria-label="첨부파일 삭제">
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

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
                게시하기
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
          <div className="admin-callout">
            <span className="admin-callout__icon">i</span>
            <p>공지를 게시하면 그 시점에 알림 신청자에게 이메일이 발송됩니다.</p>
          </div>
        </aside>
      </div>
    </AdminLayout>
  )
}
