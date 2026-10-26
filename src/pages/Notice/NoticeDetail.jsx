import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import '../../components/common/ChapterNav.css'
import { getNoticeById, noticeCategoryLabel, formatNoticeDate } from '../../api/notice'
import MarkdownLite from '../../components/common/MarkdownLite'
import heroNotice from '../../assets/images/brand/hero-faculty.jpg'
import './NoticeDetail.css'

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'academic', label: '학사' },
  { key: 'employment', label: '취업' },
]

export default function NoticeDetail() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getNoticeById(id)
      .then((result) => {
        if (!cancelled) setNotice(result)
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
  }, [id])

  // 목록에서 넘어온 분류를 우선 사용하고, 홈 등에서 바로 들어온 경우엔 글의 분류를 따른다
  const filterParam = searchParams.get('filter')
  const activeFilter = FILTERS.some((f) => f.key === filterParam)
    ? filterParam
    : notice?.employmentNotice
      ? 'employment'
      : notice?.academicNotice
        ? 'academic'
        : 'all'

  // 이전/다음글 이동 시에도 같은 분류 상태 유지
  const detailQuery = searchParams.toString() || `filter=${activeFilter}`

  // '목록으로'는 들어왔던 분류·페이지·검색 상태로 복귀
  const listParams = new URLSearchParams(searchParams)
  if (!listParams.get('filter')) listParams.set('filter', activeFilter)
  if (listParams.get('filter') === 'all') listParams.delete('filter')
  const listQuery = listParams.toString()
  const listHref = listQuery ? `/notice?${listQuery}` : '/notice'

  return (
    <div className="notice">
      <PageHero photo photoSrc={heroNotice} title={['공지사항']} />

      <div className="container page-layout">
        <nav className="chapter-nav notice__filter-nav" aria-label="공지사항 분류">
          <p className="chapter-nav__label">ON THIS PAGE</p>
          <ul className="chapter-nav__list">
            {FILTERS.map((f) => (
              <li key={f.key} className={f.key === activeFilter ? 'is-active' : ''}>
                <span className="chapter-nav__bar" />
                <Link to={f.key === 'all' ? '/notice' : `/notice?filter=${f.key}`}>{f.label}</Link>
              </li>
            ))}
            <li>
              <span className="chapter-nav__bar" />
              <Link to="/notice/subscribe">공지 알림 신청</Link>
            </li>
          </ul>
        </nav>

        <main className="page-layout__main">
          <section className="page-section">
            <h2>공지사항</h2>

            {loading && <p className="notice__loading">불러오는 중...</p>}

            {!loading && (error || !notice) && (
              <div className="notice-detail__empty">
                <p>{error || '존재하지 않는 공지사항입니다.'}</p>
                <Link to={listHref}>← 목록으로</Link>
              </div>
            )}

            {!loading && notice && (
              <div className="notice-detail__article">
                <div className="notice-detail__header">
                  <p className="notice-detail__category">{noticeCategoryLabel(notice)}</p>
                  <h1>{notice.title}</h1>
                  <p className="notice-detail__date">{formatNoticeDate(notice.publishedAt ?? notice.createdAt)}</p>
                </div>

                <div className="notice-detail__body">
                  <MarkdownLite text={notice.content ?? ''} />

                  {(notice.images ?? []).length > 0 && (
                    <div className="notice-detail__images">
                      {notice.images.map((src) => (
                        <img key={src} src={src} alt="" />
                      ))}
                    </div>
                  )}
                </div>

                {(notice.attachments ?? []).length > 0 && (
                  <div className="notice-detail__attachments">
                    <p className="notice-detail__attachments-title">첨부파일</p>
                    <div className="notice-detail__attachments-divider" />
                    {notice.attachments.map((att) => {
                      const rawUrl = att.url ?? att.fileUrl ?? ''
                      const href = rawUrl.replace(/^=+/, '')
                      return (
                        <a
                          key={rawUrl}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="notice-detail__attachment-row"
                        >
                          <span>{att.name ?? att.fileName}</span>
                          <span className="notice-detail__attachment-download">다운로드 ↓</span>
                        </a>
                      )
                    })}
                  </div>
                )}

                <div className="notice-detail__adjacent">
                  <div className="notice-detail__adjacent-row">
                    <span className="notice-detail__adjacent-label">이전글</span>
                    {notice.previousPost ? (
                      <Link to={`/notice/${notice.previousPost.id}?${detailQuery}`}>{notice.previousPost.title}</Link>
                    ) : (
                      <span className="notice-detail__adjacent-empty">이전글이 없습니다.</span>
                    )}
                  </div>
                  <div className="notice-detail__adjacent-divider" />
                  <div className="notice-detail__adjacent-row">
                    <span className="notice-detail__adjacent-label">다음글</span>
                    {notice.nextPost ? (
                      <Link to={`/notice/${notice.nextPost.id}?${detailQuery}`}>{notice.nextPost.title}</Link>
                    ) : (
                      <span className="notice-detail__adjacent-empty">다음글이 없습니다.</span>
                    )}
                  </div>
                </div>

                <div className="notice-detail__actions">
                  <Link to={listHref} className="notice-detail__back-btn">
                    목록으로
                  </Link>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
