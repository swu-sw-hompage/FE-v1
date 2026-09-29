import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import {
  createGraduationProject,
  updateGraduationProject,
  getGraduationProjectById,
  getAdminGraduationProjects,
} from '../../api/graduation'
import { ACTIVITY_YEARS } from '../../constants/activities'
import './Admin.css'

export default function CapstoneWrite() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [year, setYear] = useState(String(ACTIVITY_YEARS[0] ?? ''))
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [teamName, setTeamName] = useState('')
  const [section, setSection] = useState('')
  const [members, setMembers] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isEdit) return undefined
    let cancelled = false
    getGraduationProjectById(id)
      .then((project) => {
        if (cancelled || !project) return
        applyProject(project)
      })
      .catch(() =>
        getAdminGraduationProjects({ size: 100 })
          .then((result) => {
            if (cancelled) return
            const found = (result?.content ?? []).find((p) => String(p.id) === String(id))
            if (found) applyProject(found)
            else setError('졸업프로젝트를 불러오지 못했습니다.')
          })
          .catch((err) => {
            if (!cancelled) setError(err.message)
          }),
      )
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    function applyProject(project) {
      setYear(String(project.year ?? ''))
      setTitle(project.title ?? '')
      setSummary(project.summary ?? '')
      setTeamName(project.teamName ?? '')
      setSection(project.section ?? '')
      setMembers(project.members ?? '')
      setVideoUrl(project.videoUrl ?? '')
      setThumbnailPreview(project.thumbnailUrl ?? '')
      setDesc(project.content ?? '')
    }

    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  const handleThumbnailChange = (file) => {
    if (!file) return
    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (targetStatus) => {
    if (!year || !title.trim() || !teamName.trim() || !members.trim()) {
      setError('졸업연도, 작품명, 팀명, 팀원을 입력해주세요.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        year: Number(year),
        title,
        summary,
        teamName,
        section: section || null,
        members,
        videoUrl: videoUrl || null,
        content: desc,
        status: targetStatus === 'published' ? 'PUBLISHED' : 'DRAFT',
      }
      // NOTE: 썸네일 파일 업로드는 백엔드 엔드포인트가 multipart를 지원하는지 확인이 필요합니다.
      // 확인 전까지는 새로 선택한 파일이 있어도 URL 문자열 필드는 비워 보냅니다.
      if (isEdit) {
        await updateGraduationProject(id, payload)
      } else {
        await createGraduationProject(payload)
      }
      navigate('/admin/capstone')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout breadcrumb="졸업프로젝트 작성" eyebrow="PROJECT ARCHIVE" title={isEdit ? '졸업프로젝트 수정' : '졸업프로젝트 작성'}>
        <p className="admin-page__desc">불러오는 중...</p>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      breadcrumb={isEdit ? '졸업프로젝트 수정' : '졸업프로젝트 작성'}
      eyebrow="PROJECT ARCHIVE"
      title={isEdit ? '졸업프로젝트 수정' : '졸업프로젝트 작성'}
      description="연도별 졸업작품 정보를 등록하고 학생활동 페이지에 공개할 수 있습니다."
    >
      <div className="admin-columns">
        <form
          className="admin-form-card"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <h2 className="admin-form-card__title">프로젝트 기본 정보</h2>

          <div className="admin-form-row">
            <label className="admin-field admin-field--sm">
              <span>
                졸업연도<em>*</em>
              </span>
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                {ACTIVITY_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field admin-field--grow">
              <span>
                작품명<em>*</em>
              </span>
              <input
                type="text"
                placeholder="작품명을 입력해주세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>

          <label className="admin-field">
            <span>한 줄 소개</span>
            <input
              type="text"
              placeholder="프로젝트를 한 문장으로 소개해주세요"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </label>

          <div className="admin-form-row">
            <label className="admin-field admin-field--grow">
              <span>
                팀명<em>*</em>
              </span>
              <input
                type="text"
                placeholder="예) 코딩하는 사파리"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </label>
            <label className="admin-field admin-field--xs">
              <span>분반</span>
              <input
                type="text"
                placeholder="분반 선택"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              />
            </label>
            <label className="admin-field admin-field--grow">
              <span>
                팀원<em>*</em>
              </span>
              <input
                type="text"
                placeholder="예) 김*지, 최*연"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
              />
            </label>
          </div>

          <label className="admin-field">
            <span>시연 영상 (YouTube)</span>
            <input
              type="text"
              placeholder="https://youtube.com/…"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </label>

          <label className="admin-field">
            <span>
              썸네일<em>*</em>
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              hidden
              onChange={(e) => handleThumbnailChange(e.target.files?.[0])}
            />
            <button
              type="button"
              className="admin-upload"
              onClick={() => fileInputRef.current?.click()}
              style={thumbnailPreview ? { backgroundImage: `url(${thumbnailPreview})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : undefined}
            >
              {!thumbnailPreview && (
                <>
                  <span className="admin-upload__icon">↑</span>
                  <span className="admin-upload__text">대표 이미지를 업로드해주세요</span>
                  <span className="admin-upload__hint">JPG, PNG · 드래그하거나 클릭해서 선택</span>
                </>
              )}
            </button>
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

          <div className="admin-divider" />

          <div className="admin-form-actions">
            <Link to="/admin/capstone" className="admin-btn admin-btn--ghost">
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
          <h2 className="admin-info-card__title">작품 등록 안내</h2>
          <div className="admin-info-row admin-info-row--bordered">
            <p className="admin-info-row__label">현재 등록 연도</p>
            <p className="admin-info-row__value">{year} 졸업프로젝트</p>
          </div>
          <div className="admin-callout">
            <span className="admin-callout__icon">i</span>
            <p>공개된 작품은 학생활동 페이지의 졸업프로젝트 아카이브에 표시됩니다. 필수 항목(*)을 모두 입력한 뒤 게시해주세요.</p>
          </div>
          <Link to={`/activities/${year}`} className="admin-preview-link">
            학생활동에서 미리보기
          </Link>
        </aside>
      </div>
    </AdminLayout>
  )
}
