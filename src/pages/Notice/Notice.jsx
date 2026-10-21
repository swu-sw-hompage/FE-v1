import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import '../../components/common/ChapterNav.css'
import { noticeCategoryLabel, formatNoticeDate } from '../../api/notice'
import { getNoticesNewestFirst, isNewNotice } from '../../api/noticeOrdering'
import heroNotice from '../../assets/images/brand/hero-faculty.jpg'
import iconPrev from '../../assets/icons/pagination-prev.svg'
import iconNext from '../../assets/icons/pagination-next.svg'
import './Notice.css'

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'academic', label: '학사' },
  { key: 'employment', label: '취업' },
]

const PAGE_SIZE = 8

export default function Notice() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('filter') ?? 'all'
  const requestedPage = Number(searchParams.get('page') ?? '1')
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const pinnedOnly = searchParams.get('pinned') === '1'
  const submittedKeyword = searchParams.get('q') ?? ''
  const submittedScope = searchParams.get('scope') ?? 'title-body'

  const [scope, setScope] = useState(submittedScope)
  const [keyword, setKeyword] = useState(submittedKeyword)
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const visibleNotices = useMemo(() => (pinnedOnly ? notices.filter((notice) => notice.pinned) : notices), [notices, pinnedOnly])
  const totalPages = Math.max(1, Math.ceil(visibleNotices.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const currentNotices = visibleNotices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getNoticesNewestFirst({
      academic: filter === 'academic' ? true : undefined,
      employment: filter === 'employment' ? true : undefined,
      keyword: submittedKeyword,
      scope: submittedScope,
    })
      .then((result) => {
        if (cancelled) return
        setNotices(result)
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
  }, [filter, submittedKeyword, submittedScope])

  const setFilter = (key) => {
    const next = new URLSearchParams(searchParams)
    next.set('filter', key)
    next.set('page', '1')
    setSearchParams(next)
  }

  const runSearch = () => {
    const next = new URLSearchParams(searchParams)
    if (keyword.trim()) {
      next.set('q', keyword.trim())
    } else {
      next.delete('q')
    }
    next.set('scope', scope)
    next.set('page', '1')
    setSearchParams(next)
  }

  const togglePinnedOnly = () => {
    const next = new URLSearchParams(searchParams)
    if (pinnedOnly) next.delete('pinned')
    else next.set('pinned', '1')
    next.set('page', '1')
    setSearchParams(next)
  }

  const goToPage = (n) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(n))
    setSearchParams(next)
    document.getElementById('notice-list')?.scrollIntoView({ block: 'start' })
  }

  return (
    <div className="notice">
      <PageHero photo photoSrc={heroNotice} title={['공지사항']} />

      <div className="container page-layout">
        <nav className="chapter-nav notice__filter-nav" aria-label="공지사항 분류">
          <p className="chapter-nav__label">ON THIS PAGE</p>
          <ul className="chapter-nav__list">
            {FILTERS.map((f) => (
              <li key={f.key} className={filter === f.key ? 'is-active' : ''}>
                <span className="chapter-nav__bar" />
                <button type="button" onClick={() => setFilter(f.key)}>
                  {f.label}
                </button>
              </li>
            ))}
            <li>
              <span className="chapter-nav__bar" />
              <Link to="/notice/subscribe">공지 알림 신청</Link>
            </li>
          </ul>
        </nav>

        <main className="page-layout__main">
          <section id="notice-list" className="page-section">
            <h2>공지사항</h2>

            <div className="notice__search">
              <select
                className="notice__search-scope"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
              >
                <option value="title-body">제목 + 내용</option>
                <option value="title">제목</option>
                <option value="body">내용</option>
              </select>
              <input
                type="text"
                className="notice__search-input"
                placeholder="검색어를 입력해주세요."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') runSearch()
                }}
              />
              <button type="button" className="notice__search-btn" onClick={runSearch}>
                검색
              </button>
            </div>

            <div className="notice__view-bar">
              <span className="notice__sort-label">최신순</span>
              <button
                type="button"
                className={pinnedOnly ? 'notice__pinned-filter notice__pinned-filter--active' : 'notice__pinned-filter'}
                aria-pressed={pinnedOnly}
                onClick={togglePinnedOnly}
              >
                {pinnedOnly ? '전체 공지 보기' : '필독만 보기'}
              </button>
            </div>

            {error && <p className="notice__error">{error}</p>}

            {!error && loading && <p className="notice__loading">불러오는 중...</p>}

            {!error && !loading && currentNotices.length === 0 && (
              <p className="notice__empty">{pinnedOnly ? '필독 공지사항이 없습니다.' : '등록된 공지사항이 없습니다.'}</p>
            )}

            {!error && !loading && currentNotices.length > 0 && (
              <ul className="notice__list">
                {currentNotices.map((notice) => (
                  <li key={notice.id}>
                    <Link to={`/notice/${notice.id}`}>
                      {(notice.pinned || isNewNotice(notice)) && (
                        <span className="notice__flags">
                          {notice.pinned && <span className="notice__pin">필독</span>}
                          {isNewNotice(notice) && <span className="notice__new">NEW</span>}
                        </span>
                      )}
                      <span className="notice__category">{noticeCategoryLabel(notice)}</span>
                      <span className="notice__title">{notice.title}</span>
                    </Link>
                    <span className="notice__date">{formatNoticeDate(notice.publishedAt ?? notice.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}

            {!error && !loading && totalPages > 1 && (
              <nav className="notice__pagination" aria-label="공지사항 페이지">
                <button
                  type="button"
                  className="notice__page-arrow"
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                  aria-label="이전 페이지"
                >
                  <img src={iconPrev} alt="" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={n === currentPage ? 'notice__page-num is-active' : 'notice__page-num'}
                    onClick={() => goToPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  className="notice__page-arrow"
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                  aria-label="다음 페이지"
                >
                  <img src={iconNext} alt="" />
                </button>
              </nav>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
