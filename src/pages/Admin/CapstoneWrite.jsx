import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import { createGraduationProject, updateGraduationProject, getGraduationProjectById } from '../../api/graduation'
import { ADMIN_ACTIVITY_YEARS } from '../../constants/activities'
import './Admin.css'

export default function CapstoneWrite() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [year, setYear] = useState(String(ADMIN_ACTIVITY_YEARS[0] ?? ''))
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [teamName, setTeamName] = useState('')
  const [section, setSection] = useState('')
  const [members, setMembers] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return undefined
    let cancelled = false
    getGraduationProjectById(id)
      .then((project) => {
        if (cancelled || !project) return
        setYear(String(project.year ?? ''))
        setTitle(project.title ?? '')
        setSummary(project.summary ?? '')
        setTeamName(project.teamName ?? '')
        setSection(project.section ?? '')
        setMembers(project.members ?? '')
        setVideoUrl(project.videoUrl ?? '')
        setThumbnailUrl(project.thumbnailUrl ?? '')
        setDesc(project.content ?? '')
      })
      .catch(() => {
        // 공개 조회는 게시된 작품만 내려준다 — 임시저장 작품은 다시 불러올 방법이 없다.
        if (!cancelled) setError('졸업프로젝트를 불러오지 못했습니다. 게시되지 않은 작품은 다시 불러올 수 없습니다.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, isEdit])

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
        thumbnailUrl: thumbnailUrl || null,
        content: desc,
        status: targetStatus === 'published' ? 'PUBLISHED' : 'DRAFT',
      }
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
      <AdminLayout breadcrumb="졸업프로젝트 등록" eyebrow="PROJECT ARCHIVE" title={isEdit ? '졸업프로젝트 수정' : '졸업프로젝트 등록'}>
        <p className="admin-page__desc">불러오는 중...</p>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      breadcrumb={isEdit ? '졸업프로젝트 수정' : '졸업프로젝트 등록'}
      eyebrow="PROJECT ARCHIVE"
      title={isEdit ? '졸업프로젝트 수정' : '졸업프로젝트 등록'}
      description="연도별 졸업작품 정보를 등록하고 학생 활동 페이지에 공개할 수 있습니다."
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
                {ADMIN_ACTIVITY_YEARS.map((y) => (
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
            <span>썸네일 URL</span>
            <input
              type="text"
              placeholder="대표 이미지 URL을 입력해주세요"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
            />
            {thumbnailUrl && (
              <div
                className="admin-upload"
                style={{ backgroundImage: `url(${thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
            )}
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
            <p>공개된 작품은 학생 활동 페이지의 졸업프로젝트 아카이브에 표시됩니다. 필수 항목(*)을 모두 입력한 뒤 게시해주세요.</p>
          </div>
          <Link to={`/activities/${year}`} className="admin-preview-link">
            학생 활동에서 미리보기
          </Link>
        </aside>
      </div>
    </AdminLayout>
  )
}
