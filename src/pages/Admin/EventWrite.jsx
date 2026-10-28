import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import { uploadAttachment } from '../../api/notice'
import { resizeImage } from '../../utils/resizeImage'
import {
  createDepartmentEvent,
  updateDepartmentEvent,
  getAdminDepartmentEventById,
  formatEventDate,
  HOME_EVENT_VISIBLE_DAYS,
} from '../../api/event'
import './Admin.css'

const MAX_PHOTOS = 50
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const SUMMARY_MAX = 200

// 오늘 날짜 'YYYY-MM-DD' (로컬 시간)
const today = () => {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

let tempKey = 0
const withKey = (url) => {
  tempKey += 1
  return { key: `p${tempKey}`, url }
}

// 학과 행사 등록·수정. 사진은 고르는 즉시 서버에 올라가고, 목록 순서대로 저장된다 (첫 장 = 대표 사진).
export default function EventWrite() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState(today)
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [photos, setPhotos] = useState([])
  const [status, setStatus] = useState(null) // 수정 화면에서 지금 상태 (PUBLISHED | DRAFT)
  const [postedAt, setPostedAt] = useState(null)

  const [loading, setLoading] = useState(isEdit)
  const [loadFailed, setLoadFailed] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return undefined
    let cancelled = false
    getAdminDepartmentEventById(id)
      .then((event) => {
        if (cancelled || !event) return
        setTitle(event.title ?? '')
        setEventDate(event.date ?? today())
        setSummary(event.summary ?? '')
        setContent(event.content ?? '')
        setPhotos(event.photos.map(withKey))
        setStatus(event.status)
        setPostedAt(event.postedAt)
      })
      .catch((err) => {
        if (cancelled) return
        setLoadFailed(true)
        setError(err.status === 404 ? '삭제되었거나 없는 행사입니다.' : `행사를 불러오지 못했습니다: ${err.message}`)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  const addFiles = async (fileList) => {
    const files = Array.from(fileList ?? [])
    if (files.length === 0) return
    if (files.some((f) => !IMAGE_TYPES.includes(f.type))) {
      setError('JPG, PNG, WEBP 이미지만 올릴 수 있습니다.')
      return
    }
    if (photos.length + files.length > MAX_PHOTOS) {
      setError(`사진은 한 행사에 최대 ${MAX_PHOTOS}장까지 올릴 수 있습니다.`)
      return
    }
    setError('')
    setUploading(true)
    try {
      for (const file of files) {
        const uploaded = await uploadAttachment(await resizeImage(file))
        setPhotos((prev) => [...prev, withKey(uploaded.url)])
      }
    } catch (err) {
      setError(`사진을 올리지 못했습니다: ${err.message}`)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const move = (index, delta) => {
    const target = index + delta
    if (target < 0 || target >= photos.length) return
    setPhotos((prev) => {
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const makeCover = (index) =>
    setPhotos((prev) => [prev[index], ...prev.slice(0, index), ...prev.slice(index + 1)])

  const remove = (key) => setPhotos((prev) => prev.filter((p) => p.key !== key))

  const handleSubmit = async (targetStatus) => {
    if (!title.trim() || !eventDate) {
      setError('행사명과 행사 날짜를 입력해주세요.')
      return
    }
    if (targetStatus === 'PUBLISHED' && photos.length === 0) {
      setError('게시하려면 사진을 한 장 이상 올려주세요. (사진 없이 저장하려면 임시저장)')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        title: title.trim(),
        eventDate,
        summary: summary.trim(),
        content,
        photos: photos.map((p) => p.url),
        status: targetStatus,
      }
      if (isEdit) await updateDepartmentEvent(id, payload)
      else await createDepartmentEvent(payload)

      const toast =
        targetStatus === 'PUBLISHED'
          ? isEdit && status === 'PUBLISHED'
            ? '행사를 수정했습니다.'
            : '행사를 게시했습니다. 홈 상단에 7일 동안 알림이 뜹니다.'
          : '임시저장했습니다. 사이트에는 아직 보이지 않습니다.'
      navigate('/admin/events', { state: { toast } })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const pageTitle = isEdit ? '학과 행사 수정' : '학과 행사 등록'

  if (loading) {
    return (
      <AdminLayout breadcrumb={pageTitle} eyebrow="DEPARTMENT EVENTS" title={pageTitle}>
        <p className="admin-page__desc">불러오는 중...</p>
      </AdminLayout>
    )
  }

  if (loadFailed) {
    return (
      <AdminLayout breadcrumb={pageTitle} eyebrow="DEPARTMENT EVENTS" title={pageTitle}>
        <p className="admin-writer__error" role="alert">
          {error}
        </p>
        <Link to="/admin/events" className="admin-btn admin-btn--outline">
          목록으로
        </Link>
      </AdminLayout>
    )
  }

  const alreadyPosted = isEdit && status === 'PUBLISHED'
  const busy = submitting || uploading

  return (
    <AdminLayout
      breadcrumb={pageTitle}
      eyebrow="DEPARTMENT EVENTS"
      title={pageTitle}
      description="행사 정보와 사진을 올리면 학과 활동 > 학과 행사에 사진첩처럼 보입니다."
    >
      <div className="admin-columns">
        <form className="admin-form-card" onSubmit={(e) => e.preventDefault()}>
          <h2 className="admin-form-card__title">행사 정보</h2>

          <div className="admin-form-row">
            <label className="admin-field admin-field--grow">
              <span>
                행사명<em>*</em>
              </span>
              <input
                type="text"
                maxLength={200}
                placeholder="예) 2026 졸업작품 전시회 및 시상식"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="admin-field admin-field--sm">
              <span>
                행사 날짜<em>*</em>
              </span>
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </label>
          </div>

          <label className="admin-field">
            <span>
              한두 줄 소개 <small className="admin-event__counter">{summary.length} / {SUMMARY_MAX}</small>
            </span>
            <input
              type="text"
              maxLength={SUMMARY_MAX}
              placeholder="목록에 보이는 짧은 소개 (예: 올해 졸업작품 32팀의 전시와 우수작 시상이 있었습니다.)"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </label>

          <label className="admin-field">
            <span>본문</span>
            <textarea
              rows={6}
              placeholder="상세 페이지에 보일 내용 (선택). 줄을 바꾸면 문단이 나뉩니다."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>

          <div className="admin-divider" />

          <h2 className="admin-form-card__title">
            사진 <span className="admin-hero__count">{photos.length} / {MAX_PHOTOS}</span>
          </h2>
          <p className="admin-hero__hint">
            첫 번째 사진이 목록·홈 알림의 대표 사진이 됩니다. 순서대로 상세 페이지에 보여요.
          </p>

          {photos.length > 0 && (
            <ul className="admin-hero__list">
              {photos.map((photo, i) => (
                <li key={photo.key} className="admin-hero__item">
                  <span className="admin-hero__order">{i + 1}</span>
                  <img className="admin-hero__thumb" src={photo.url} alt={`${i + 1}번째 사진`} />
                  <div className="admin-hero__badges">
                    {i === 0 && <span className="admin-badge admin-badge--pink">대표 사진</span>}
                  </div>
                  <div className="admin-hero__actions">
                    {i > 0 && (
                      <button type="button" className="admin-table__btn" onClick={() => makeCover(i)}>
                        대표로
                      </button>
                    )}
                    <button
                      type="button"
                      className="admin-table__btn"
                      aria-label={`${i + 1}번째 사진 위로`}
                      disabled={i === 0}
                      onClick={() => move(i, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-table__btn"
                      aria-label={`${i + 1}번째 사진 아래로`}
                      disabled={i === photos.length - 1}
                      onClick={() => move(i, 1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-table__btn admin-table__btn--danger"
                      onClick={() => remove(photo.key)}
                    >
                      빼기
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            className={`admin-upload${dragOver ? ' admin-upload--active' : ''}`}
            disabled={uploading || photos.length >= MAX_PHOTOS}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              addFiles(e.dataTransfer.files)
            }}
          >
            <span className="admin-upload__icon">+</span>
            <span className="admin-upload__text">
              {uploading ? '올리는 중...' : '사진을 끌어다 놓거나 클릭해서 선택하세요 (여러 장 가능)'}
            </span>
            <span className="admin-upload__hint">JPG, PNG, WEBP · 맨 뒤에 추가됩니다</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={IMAGE_TYPES.join(',')}
            multiple
            hidden
            onChange={(e) => addFiles(e.target.files)}
          />

          <div className="admin-divider" />

          <div className="admin-form-actions">
            <Link to="/admin/events" className="admin-btn admin-btn--ghost">
              취소
            </Link>
            <div className="admin-form-actions__right">
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                disabled={busy}
                onClick={() => handleSubmit('DRAFT')}
              >
                {alreadyPosted ? '게시 내리고 임시저장' : '임시저장'}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                disabled={busy}
                onClick={() => handleSubmit('PUBLISHED')}
              >
                {alreadyPosted ? '수정 내용 저장' : '게시하기'}
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
          <h2 className="admin-info-card__title">행사 등록 안내</h2>
          <div className="admin-info-row admin-info-row--bordered">
            <p className="admin-info-row__label">현재 상태</p>
            <p className="admin-info-row__value">
              {!isEdit ? '새 행사' : status === 'PUBLISHED' ? '게시중' : '임시저장'}
            </p>
          </div>
          {postedAt && (
            <div className="admin-info-row admin-info-row--bordered">
              <p className="admin-info-row__label">처음 게시한 날</p>
              <p className="admin-info-row__value">{formatEventDate(String(postedAt).slice(0, 10))}</p>
            </div>
          )}
          <div className="admin-callout">
            <span className="admin-callout__icon">i</span>
            <p>
              게시하면 홈 상단 알림 띠와 메뉴의 &lsquo;학과 활동&rsquo; 점이 처음 게시한 날부터 {HOME_EVENT_VISIBLE_DAYS}일
              동안 보이고 저절로 사라집니다. 게시 후에 내용을 고쳐도 기간은 다시 늘어나지 않아요.
            </p>
          </div>
          {alreadyPosted ? (
            <Link to={`/activities/events/${id}`} target="_blank" rel="noopener noreferrer" className="admin-preview-link">
              사이트에서 보기
            </Link>
          ) : (
            <Link to="/activities/events" target="_blank" rel="noopener noreferrer" className="admin-preview-link">
              학과 행사 페이지 열기
            </Link>
          )}
        </aside>
      </div>
    </AdminLayout>
  )
}
