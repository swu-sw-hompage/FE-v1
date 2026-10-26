import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import '../../components/common/ChapterNav.css'
import { getNoticeById, getNotices, noticeCategoryLabel, formatNoticeDate } from '../../api/notice'
import EmptyState from '../../components/common/EmptyState'
import MarkdownLite from '../../components/common/MarkdownLite'
import heroNotice from '../../assets/images/brand/hero-faculty.jpg'
import './Notice.css'
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
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [recent, setRecent] = useState([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getNoticeById(id)
      .then((result) => {
        if (!cancelled) setNotice(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, reloadKey])

  // 404거나 결과가 비어 있으면 '없는 글', 그 외 실패는 '불러오기 실패'로 본다
  const notFound = !loading && ((!error && !notice) || error?.status === 404 || error?.status === 400)
  const loadFailed = !loading && error && !notFound

  // 없는 글일 때 바로 다른 글로 갈 수 있게 최근 공지 몇 개를 보여준다
  useEffect(() => {
    if (!notFound) return
    let cancelled = false
    getNotices({ page: 0, size: 4 })
      .then((result) => {
        if (!cancelled) setRecent(result?.content ?? [])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [notFound])

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

            {notFound && (
              <EmptyState
                title="공지사항을 찾을 수 없습니다"
                description="삭제되었거나 주소가 바뀌었을 수 있어요. 목록에서 다시 찾아봐 주세요."
                actions={[
                  { label: '목록으로 돌아가기', to: listHref },
                  { label: '공지 알림 신청', to: '/notice/subscribe' },
                ]}
              />
            )}

            {notFound && recent.length > 0 && (
              <div className="notice-detail__recent">
                <p className="notice-detail__recent-title">최근 공지</p>
                <ul className="notice__list">
                  {recent.map((item) => (
                    <li key={item.id}>
                      <Link to={`/notice/${item.id}`}>
                        {noticeCategoryLabel(item) && (
                          <span className="notice__category">{noticeCategoryLabel(item)}</span>
                        )}
                        <span className="notice__title">{item.title}</span>
                      </Link>
                      <span className="notice__date">{formatNoticeDate(item.publishedAt ?? item.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {loadFailed && (
              <EmptyState
                icon="error"
                code="ERROR"
                title="공지사항을 불러오지 못했습니다"
                description="일시적인 문제일 수 있어요. 잠시 후 다시 시도해 주세요."
                actions={[
                  { label: '다시 시도', onClick: () => setReloadKey((k) => k + 1) },
                  { label: '목록으로 돌아가기', to: listHref },
                ]}
              />
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
