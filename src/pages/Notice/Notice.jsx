import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import '../../components/common/ChapterNav.css'
import { getNotices, noticeCategoryLabel, formatNoticeDate } from '../../api/notice'
import { requestVerificationCode, verifyCode, subscribe } from '../../api/notification'
import heroNotice from '../../assets/images/brand/hero-faculty.jpg'
import iconPrev from '../../assets/icons/pagination-prev.svg'
import iconNext from '../../assets/icons/pagination-next.svg'
import './Notice.css'
import './NoticeSubscribe.css'

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'academic', label: '학사' },
  { key: 'employment', label: '취업' },
]

const SUBSCRIBE_CATEGORIES = [
  { id: 'academic', label: '학사공지' },
  { id: 'career', label: '취업공지' },
]

const PAGE_SIZE = 8

export default function Notice() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('filter') ?? 'all'
  const page = Number(searchParams.get('page') ?? '1')
  const submittedKeyword = searchParams.get('q') ?? ''
  const submittedScope = searchParams.get('scope') ?? 'title-body'

  const [scope, setScope] = useState(submittedScope)
  const [keyword, setKeyword] = useState(submittedKeyword)
  const [notices, setNotices] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 공지 알림 신청 폼 상태
  const [subCategories, setSubCategories] = useState(['academic'])
  const [email, setEmail] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState('')
  const [verified, setVerified] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [subError, setSubError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getNotices({
      academic: filter === 'academic' ? true : undefined,
      employment: filter === 'employment' ? true : undefined,
      keyword: submittedKeyword,
      scope: submittedScope,
      page: page - 1,
      size: PAGE_SIZE,
    })
      .then((result) => {
        if (cancelled) return
        const content = result?.content ?? []
        const pinned = content.filter((n) => n.pinned)
        const rest = content.filter((n) => !n.pinned)
        setNotices([...pinned, ...rest])
        setTotalPages(Math.max(1, result?.totalPages ?? 1))
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
  }, [filter, page, submittedKeyword, submittedScope])

  // 다른 페이지의 메가메뉴에서 /notice#notice-subscribe로 넘어왔을 때 해당 섹션으로 스크롤
  useEffect(() => {
    if (!location.hash) return
    document.querySelector(location.hash)?.scrollIntoView({ block: 'start' })
  }, [location.hash])

  useEffect(() => {
    if (!showToast) return undefined
    const timer = setTimeout(() => setShowToast(false), 2800)
    return () => clearTimeout(timer)
  }, [showToast])

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

  const goToPage = (n) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(n))
    setSearchParams(next)
    document.getElementById('notice-list')?.scrollIntoView({ block: 'start' })
  }

  const toggleSubCategory = (id) => {
    setSubCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const handleSendCode = async () => {
    if (!email) return
    setSubError('')
    setSending(true)
    try {
      await requestVerificationCode({ email })
      setCodeSent(true)
    } catch (err) {
      setSubError(err.message)
    } finally {
      setSending(false)
    }
  }

  const handleVerify = async () => {
    if (!code) return
    setSubError('')
    setVerifying(true)
    try {
      await verifyCode({ email, verificationCode: code })
      setVerified(true)
    } catch (err) {
      setSubError(err.message)
    } finally {
      setVerifying(false)
    }
  }

  const canSubmitSubscribe = subCategories.length > 0 && verified && agreed && !submitting

  const handleSubscribeSubmit = async () => {
    if (!canSubmitSubscribe) return
    setSubError('')
    setSubmitting(true)
    try {
      await subscribe({
        email,
        academicNotice: subCategories.includes('academic'),
        employmentNotice: subCategories.includes('career'),
        privacyConsent: agreed,
      })
      setSubmitted(true)
      setShowToast(true)
    } catch (err) {
      setSubError(err.message)
    } finally {
      setSubmitting(false)
    }
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
              <a href="#notice-subscribe">공지 알림 신청</a>
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

            {error && <p className="notice__error">{error}</p>}

            {!error && loading && <p className="notice__loading">불러오는 중...</p>}

            {!error && !loading && notices.length === 0 && (
              <p className="notice__empty">등록된 공지사항이 없습니다.</p>
            )}

            {!error && !loading && notices.length > 0 && (
              <ul className="notice__list">
                {notices.map((notice) => (
                  <li key={notice.id}>
                    <Link to={`/notice/${notice.id}`}>
                      {notice.pinned && <span className="notice__pin">공지</span>}
                      <span className="notice__category">{noticeCategoryLabel(notice)} ·</span>
                      <span className="notice__title">{notice.title}</span>
                    </Link>
                    <span className="notice__date">{formatNoticeDate(notice.publishedAt ?? notice.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}

            {totalPages > 1 && (
              <nav className="notice__pagination" aria-label="공지사항 페이지">
                <button
                  type="button"
                  className="notice__page-arrow"
                  disabled={page === 1}
                  onClick={() => goToPage(page - 1)}
                  aria-label="이전 페이지"
                >
                  <img src={iconPrev} alt="" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={n === page ? 'notice__page-num is-active' : 'notice__page-num'}
                    onClick={() => goToPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  className="notice__page-arrow"
                  disabled={page === totalPages}
                  onClick={() => goToPage(page + 1)}
                  aria-label="다음 페이지"
                >
                  <img src={iconNext} alt="" />
                </button>
              </nav>
            )}
          </section>

          <section id="notice-subscribe" className="page-section">
            <h2>공지 알림 신청</h2>

            <div className="notice-subscribe__form">
              <p className="notice-subscribe__form-title">받을 공지를 선택해주세요</p>
              <div className="notice-subscribe__divider" />

              <div className="notice-subscribe__row">
                <div className="notice-subscribe__row-label">
                  <p>알림 받을 공지</p>
                  <span>* 중복 선택 가능</span>
                </div>
                <div className="notice-subscribe__row-content">
                  <div className="notice-subscribe__categories">
                    {SUBSCRIBE_CATEGORIES.map((c) => {
                      const active = subCategories.includes(c.id)
                      return (
                        <button
                          key={c.id}
                          type="button"
                          className={
                            active
                              ? 'notice-subscribe__category notice-subscribe__category--active'
                              : 'notice-subscribe__category'
                          }
                          onClick={() => toggleSubCategory(c.id)}
                          aria-pressed={active}
                        >
                          {c.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="notice-subscribe__divider" />

              <div className="notice-subscribe__row">
                <div className="notice-subscribe__row-label">
                  <p>이메일 인증</p>
                </div>
                <div className="notice-subscribe__row-content">
                  <div className="notice-subscribe__field">
                    <p className="notice-subscribe__field-label">이메일 주소</p>
                    <div className="notice-subscribe__pair">
                      <input
                        type="email"
                        className="notice-subscribe__input"
                        placeholder="example@swu.ac.kr"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setCodeSent(false)
                          setVerified(false)
                        }}
                      />
                      <button
                        type="button"
                        className="notice-subscribe__side-btn notice-subscribe__side-btn--primary-outline"
                        onClick={handleSendCode}
                        disabled={!email || sending}
                      >
                        {sending ? '전송 중...' : codeSent ? '재전송' : '인증번호 받기'}
                      </button>
                    </div>
                    {codeSent && !verified && (
                      <p className="notice-subscribe__hint">인증번호를 이메일로 보냈습니다.</p>
                    )}
                  </div>

                  <div className="notice-subscribe__field">
                    <p className="notice-subscribe__field-label">인증번호</p>
                    <div className="notice-subscribe__pair">
                      <input
                        type="text"
                        className="notice-subscribe__input"
                        placeholder="6자리 인증번호 입력"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        disabled={!codeSent || verified}
                      />
                      <button
                        type="button"
                        className={
                          verified
                            ? 'notice-subscribe__side-btn notice-subscribe__side-btn--done'
                            : 'notice-subscribe__side-btn'
                        }
                        onClick={handleVerify}
                        disabled={!codeSent || !code || verified || verifying}
                      >
                        {verifying ? '확인 중...' : verified ? '인증 완료' : '인증하기'}
                      </button>
                    </div>
                  </div>

                  {subError && (
                    <p className="notice-subscribe__hint notice-subscribe__hint--error" role="alert">
                      {subError}
                    </p>
                  )}
                </div>
              </div>

              <div className="notice-subscribe__divider" />

              <div className="notice-subscribe__row">
                <div className="notice-subscribe__row-label">
                  <p>개인정보 이용 동의</p>
                </div>
                <div className="notice-subscribe__row-content">
                  <div className="notice-subscribe__consent">
                    <button
                      type="button"
                      className={
                        agreed
                          ? 'notice-subscribe__check notice-subscribe__check--active'
                          : 'notice-subscribe__check'
                      }
                      onClick={() => setAgreed((v) => !v)}
                      aria-pressed={agreed}
                      aria-label="개인정보 수집 및 이용에 동의합니다"
                    />
                    <p>개인정보 수집 및 이용에 동의합니다.</p>
                  </div>
                  <p className="notice-subscribe__note">
                    입력한 이메일은 공지 알림 발송을 위해서만 사용됩니다.
                  </p>
                </div>
              </div>

              <div className="notice-subscribe__actions">
                <button
                  type="button"
                  className="notice-subscribe__submit"
                  onClick={handleSubscribeSubmit}
                  disabled={!canSubmitSubscribe}
                >
                  {submitting ? '신청 중...' : submitted ? '알림 신청 완료' : '알림 신청하기'}
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {showToast && (
        <div className="notice-subscribe__toast" role="status">
          신청이 완료되었습니다🎉
        </div>
      )}
    </div>
  )
}
