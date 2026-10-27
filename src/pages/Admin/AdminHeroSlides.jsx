import { useEffect, useRef, useState } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import ConfirmModal from '../../components/admin/ConfirmModal'
import AdminToast from '../../components/admin/AdminToast'
import { uploadAttachment } from '../../api/notice'
import { getAdminHeroSlides, saveHeroSlides, heroImageUrl } from '../../api/hero'
import './Admin.css'

const MAX_SLIDES = 10
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const PREVIEW_INTERVAL_MS = 5000

// 화면에서 쓰는 사진 한 장: 저장된 사진은 id, 새로 올린 사진은 id 없이 imageUrl만 있다.
// key는 목록 렌더링용 (새 사진은 임시 키).
let tempKey = 0
const fromServer = (slide) => ({ key: `s${slide.id}`, id: slide.id, imageUrl: slide.imageUrl })

const sameList = (a, b) =>
  a.length === b.length && a.every((s, i) => s.id === b[i].id && s.imageUrl === b[i].imageUrl)

// 메인 화면 hero 모양 그대로 사진을 돌려 보여준다 (왼쪽 사진 + 오른쪽 흰색 페이드 + 점).
function HeroPreview({ slides }) {
  const [index, setIndex] = useState(0)
  const active = index < slides.length ? index : 0

  useEffect(() => {
    if (slides.length < 2) return undefined
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), PREVIEW_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [slides.length, active])

  return (
    <div className="admin-hero-preview">
      <div className="admin-hero-preview__media">
        {slides.map((slide, i) => (
          <img
            key={slide.key}
            className={`admin-hero-preview__img${i === active ? ' is-active' : ''}`}
            src={heroImageUrl(slide.imageUrl)}
            alt=""
          />
        ))}
        {slides.length > 1 && (
          <div className="admin-hero-preview__dots">
            {slides.map((slide, i) => (
              <button
                key={slide.key}
                type="button"
                className={`admin-hero-preview__dot${i === active ? ' is-active' : ''}`}
                aria-label={`${i + 1}번째 사진 보기`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
      <div className="admin-hero-preview__text" aria-hidden="true">
        <span />
        <span />
        <span className="is-short" />
      </div>
      {slides.length === 0 && <p className="admin-hero-preview__empty">사진이 없습니다</p>}
      {slides.length > 0 && (
        <p className="admin-hero-preview__counter">
          {active + 1} / {slides.length}
        </p>
      )}
    </div>
  )
}

// 메인 화면 상단(hero)에서 자동으로 넘어가는 사진을 관리한다. 목록 순서 = 화면에 나오는 순서.
// 추가·삭제·순서 변경은 화면에서만 바뀌고, 저장하기를 눌러야 실제 사이트에 반영된다.
export default function AdminHeroSlides() {
  const [saved, setSaved] = useState([])
  const [draft, setDraft] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [toast, setToast] = useState('')
  const fileInputRef = useRef(null)

  const dirty = !sameList(draft, saved)

  useEffect(() => {
    getAdminHeroSlides()
      .then((result) => {
        const list = (result ?? []).map(fromServer)
        setSaved(list)
        setDraft(list)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // 저장하지 않은 변경이 있으면 창을 닫거나 새로고침할 때 브라우저가 한 번 물어본다.
  useEffect(() => {
    if (!dirty) return undefined
    const warn = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const addFiles = async (fileList) => {
    const files = Array.from(fileList ?? [])
    if (files.length === 0) return
    if (files.some((f) => !IMAGE_TYPES.includes(f.type))) {
      setError('JPG, PNG, WEBP 이미지만 올릴 수 있습니다.')
      return
    }
    if (draft.length + files.length > MAX_SLIDES) {
      setError(`메인 사진은 최대 ${MAX_SLIDES}장까지 등록할 수 있습니다.`)
      return
    }
    setError('')
    setUploading(true)
    try {
      // 파일은 바로 서버에 올라가지만, 메인 화면에는 저장하기 전까지 나오지 않는다.
      for (const file of files) {
        const uploaded = await uploadAttachment(file)
        tempKey += 1
        setDraft((prev) => [...prev, { key: `n${tempKey}`, id: null, imageUrl: uploaded.url }])
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
    if (target < 0 || target >= draft.length) return
    setDraft((prev) => {
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const remove = (key) => setDraft((prev) => prev.filter((s) => s.key !== key))

  const handleSave = async () => {
    if (draft.length === 0) {
      setError('사진을 한 장 이상 남겨주세요.')
      return
    }
    setError('')
    setSaving(true)
    try {
      const result = await saveHeroSlides(draft.map((s) => (s.id ? { id: s.id } : { imageUrl: s.imageUrl })))
      const list = (result ?? []).map(fromServer)
      setSaved(list)
      setDraft(list)
      setToast('저장했습니다. 메인 화면에 바로 반영됩니다.')
    } catch (err) {
      setError(`저장하지 못했습니다: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const discard = () => {
    setDraft(saved)
    setError('')
    setDiscardOpen(false)
  }

  const isNew = (slide) => !slide.id
  const savedPosition = (slide) => saved.findIndex((s) => s.id === slide.id)

  return (
    <AdminLayout
      breadcrumb="메인 사진"
      eyebrow="MAIN HERO"
      title="메인 사진 관리"
      description="메인 화면 상단에서 5초마다 넘어가는 사진을 추가하고 순서를 바꿀 수 있습니다. 저장하기를 눌러야 사이트에 반영됩니다."
    >
      <div className="admin-form-card">
        <h2 className="admin-form-card__title">미리보기</h2>
        <p className="admin-hero__hint">아래 목록대로 메인 화면에 나오는 모습입니다. 저장 전 상태도 그대로 보여줍니다.</p>
        {!loading && <HeroPreview slides={draft} />}
      </div>

      <div className="admin-form-card">
        <h2 className="admin-form-card__title">
          사진 목록 <span className="admin-hero__count">{draft.length} / {MAX_SLIDES}</span>
        </h2>
        <p className="admin-hero__hint">
          위에 있는 사진부터 차례로 보여집니다. 가로로 긴 사진(약 1920×1080)이 좋고, 사진 오른쪽은 흰색으로 흐려지니
          중요한 내용은 왼쪽에 오는 사진을 골라주세요.
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
            {draft.length === 0 && <li className="admin-hero__empty">사진이 없습니다. 아래에서 추가해주세요.</li>}
            {draft.map((slide, i) => (
              <li key={slide.key} className="admin-hero__item">
                <span className="admin-hero__order">{i + 1}</span>
                <img className="admin-hero__thumb" src={heroImageUrl(slide.imageUrl)} alt={`${i + 1}번째 메인 사진`} />
                <div className="admin-hero__badges">
                  {isNew(slide) && <span className="admin-badge admin-badge--pink">새 사진</span>}
                  {!isNew(slide) && savedPosition(slide) !== i && (
                    <span className="admin-badge admin-badge--gray">순서 변경</span>
                  )}
                </div>
                <div className="admin-hero__actions">
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
                    disabled={i === draft.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="admin-table__btn admin-table__btn--danger"
                    onClick={() => remove(slide.key)}
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
          disabled={uploading || draft.length >= MAX_SLIDES}
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
              : draft.length >= MAX_SLIDES
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

        <div className="admin-divider" />

        <div className="admin-form-actions">
          <p className={dirty ? 'admin-hero__status is-dirty' : 'admin-hero__status'}>
            {dirty ? '저장하지 않은 변경이 있습니다' : '사이트에 반영된 상태입니다'}
          </p>
          <div className="admin-form-actions__right">
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              disabled={!dirty || saving}
              onClick={() => setDiscardOpen(true)}
            >
              변경 취소
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              disabled={!dirty || saving || uploading}
              onClick={handleSave}
            >
              {saving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={discardOpen}
        title="변경을 취소할까요?"
        description="저장하지 않은 추가·삭제·순서 변경이 모두 사라지고, 지금 사이트에 나오는 상태로 돌아갑니다."
        confirmLabel="변경 취소"
        cancelLabel="계속 편집"
        onConfirm={discard}
        onCancel={() => setDiscardOpen(false)}
      />
      <AdminToast message={toast} onClose={() => setToast('')} />
    </AdminLayout>
  )
}
