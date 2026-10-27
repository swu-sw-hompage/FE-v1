import { useEffect, useRef, useState } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import ConfirmModal from '../../components/admin/ConfirmModal'
import AdminToast from '../../components/admin/AdminToast'
import { uploadAttachment } from '../../api/notice'
import {
  getAdminHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  reorderHeroSlides,
  deleteHeroSlide,
  heroImageUrl,
} from '../../api/hero'
import './Admin.css'

const MAX_SLIDES = 10
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// 메인 화면 상단(hero)에서 자동으로 넘어가는 사진을 관리한다. 목록 순서 = 화면에 나오는 순서.
export default function AdminHeroSlides() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [altDrafts, setAltDrafts] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    getAdminHeroSlides()
      .then((result) => setSlides(result ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addFiles = async (fileList) => {
    const files = Array.from(fileList ?? [])
    if (files.length === 0) return
    if (files.some((f) => !IMAGE_TYPES.includes(f.type))) {
      setError('JPG, PNG, WEBP 이미지만 올릴 수 있습니다.')
      return
    }
    if (slides.length + files.length > MAX_SLIDES) {
      setError(`메인 사진은 최대 ${MAX_SLIDES}장까지 등록할 수 있습니다.`)
      return
    }
    setError('')
    setUploading(true)
    try {
      for (const file of files) {
        const uploaded = await uploadAttachment(file)
        // 설명은 일단 파일 이름에서 확장자를 뺀 것으로 두고, 목록에서 바로 고칠 수 있게 한다.
        const altText = uploaded.name.replace(/\.[^.]+$/, '') || '메인 사진'
        const created = await createHeroSlide({ imageUrl: uploaded.url, altText })
        setSlides((prev) => [...prev, created])
      }
      setToast('사진을 추가했습니다.')
    } catch (err) {
      setError(`사진을 추가하지 못했습니다: ${err.message}`)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const move = async (index, delta) => {
    const target = index + delta
    if (target < 0 || target >= slides.length) return
    const next = [...slides]
    ;[next[index], next[target]] = [next[target], next[index]]
    const previous = slides
    setSlides(next)
    setError('')
    try {
      setSlides(await reorderHeroSlides(next.map((s) => s.id)))
    } catch (err) {
      setSlides(previous)
      setError(err.message)
    }
  }

  const saveAlt = async (slide) => {
    const altText = (altDrafts[slide.id] ?? slide.altText).trim()
    if (!altText || altText === slide.altText) return
    setBusyId(slide.id)
    setError('')
    try {
      const updated = await updateHeroSlide(slide.id, { altText })
      setSlides((prev) => prev.map((s) => (s.id === slide.id ? updated : s)))
      setAltDrafts((prev) => {
        const { [slide.id]: _, ...rest } = prev
        return rest
      })
      setToast('설명을 저장했습니다.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteHeroSlide(deleteTarget.id)
      setSlides((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      setToast('사진을 삭제했습니다.')
      setDeleteTarget(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout
      breadcrumb="메인 사진"
      eyebrow="MAIN HERO"
      title="메인 사진 관리"
      description="메인 화면 상단에서 5초마다 넘어가는 사진을 추가하고, 순서와 설명을 바꿀 수 있습니다."
    >
      <div className="admin-form-card">
        <h2 className="admin-form-card__title">
          사진 목록 <span className="admin-hero__count">{slides.length} / {MAX_SLIDES}</span>
        </h2>
        <p className="admin-hero__hint">
          위에 있는 사진부터 차례로 보여집니다. 가로로 긴 사진(약 1920×1080)이 좋고, 사진 오른쪽은 흰색으로 흐려지니
          중요한 내용은 왼쪽에 오는 사진을 골라주세요. 설명은 화면을 읽어주는 기능에 쓰입니다.
        </p>

        {error && (
          <p className="admin-writer__error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className="admin-page__desc">불러오는 중...</p>
        ) : (
          <ul className="admin-hero__list">
            {slides.length === 0 && (
              <li className="admin-hero__empty">등록된 사진이 없어 메인 화면에는 기본 사진 3장이 나옵니다.</li>
            )}
            {slides.map((slide, i) => {
              const altValue = altDrafts[slide.id] ?? slide.altText
              const altChanged = altValue.trim() !== slide.altText
              return (
                <li key={slide.id} className="admin-hero__item">
                  <span className="admin-hero__order">{i + 1}</span>
                  <img className="admin-hero__thumb" src={heroImageUrl(slide.imageUrl)} alt="" />
                  <label className="admin-field admin-hero__alt">
                    <span>사진 설명</span>
                    <input
                      type="text"
                      maxLength={200}
                      value={altValue}
                      onChange={(e) => setAltDrafts((prev) => ({ ...prev, [slide.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && saveAlt(slide)}
                    />
                  </label>
                  <div className="admin-hero__actions">
                    {altChanged && (
                      <button
                        type="button"
                        className="admin-table__btn"
                        disabled={busyId === slide.id || !altValue.trim()}
                        onClick={() => saveAlt(slide)}
                      >
                        저장
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
                      disabled={i === slides.length - 1}
                      onClick={() => move(i, 1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-table__btn admin-table__btn--danger"
                      onClick={() => setDeleteTarget(slide)}
                    >
                      삭제
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <button
          type="button"
          className={`admin-upload${dragOver ? ' admin-upload--active' : ''}`}
          disabled={uploading || slides.length >= MAX_SLIDES}
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
            {uploading
              ? '올리는 중...'
              : slides.length >= MAX_SLIDES
                ? `최대 ${MAX_SLIDES}장까지 등록할 수 있습니다`
                : '사진을 끌어다 놓거나 클릭해서 선택하세요'}
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
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="사진을 삭제할까요?"
        description="메인 화면에서 바로 빠집니다."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <AdminToast message={toast} onClose={() => setToast('')} />
    </AdminLayout>
  )
}
