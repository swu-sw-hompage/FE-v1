import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import '../../components/common/ChapterNav.css'
import { requestVerificationCode, verifyCode, subscribe, unsubscribe } from '../../api/notification'
import { trackSubscribePageView } from '../../api/analytics'
import heroNotice from '../../assets/images/brand/hero-faculty.jpg'
import './NoticeSubscribe.css'

// 메일(SMTP) 발송 설정이 끝나기 전까지 신청 폼을 막고 안내 문구를 덮어 둔다.
// 설정이 완료되면 true로 바꾸면 폼이 그대로 다시 열린다.
const SUBSCRIBE_READY = true

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'academic', label: '학사' },
  { key: 'employment', label: '취업' },
]

const CATEGORIES = [
  { id: 'academic', label: '학사공지' },
  { id: 'career', label: '취업공지' },
]

export default function NoticeSubscribe() {
  const [categories, setCategories] = useState(['academic'])
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
  const [error, setError] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  // 알림 메일의 "취소" 링크(?unsubscribe=이메일&token=서명)로 들어오면 해지 확인 창을 띄운다.
  // token은 메일을 받은 본인임을 증명하는 값이라 그대로 백엔드에 넘긴다.
  const [searchParams, setSearchParams] = useSearchParams()
  const unsubscribeEmail = searchParams.get('unsubscribe')
  const unsubscribeToken = searchParams.get('token') ?? ''
  const [unsubscribing, setUnsubscribing] = useState(false)
  const [unsubscribeError, setUnsubscribeError] = useState('')

  const closeUnsubscribe = () => {
    setUnsubscribeError('')
    setSearchParams({}, { replace: true })
  }

  const handleUnsubscribe = async () => {
    setUnsubscribeError('')
    setUnsubscribing(true)
    try {
      await unsubscribe({ email: unsubscribeEmail, token: unsubscribeToken })
      closeUnsubscribe()
      setToastMessage('알림 신청이 취소되었습니다.')
      setShowToast(true)
    } catch (err) {
      setUnsubscribeError(err.message)
    } finally {
      setUnsubscribing(false)
    }
  }

  // 메일의 해지 링크로 들어온 경우는 신청 페이지 조회로 세지 않는다.
  useEffect(() => {
    if (!unsubscribeEmail) trackSubscribePageView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!showToast) return undefined
    const timer = setTimeout(() => setShowToast(false), 2800)
    return () => clearTimeout(timer)
  }, [showToast])

  const resetForm = () => {
    setCategories(['academic'])
    setEmail('')
    setCodeSent(false)
    setCode('')
    setVerified(false)
    setAgreed(false)
    setSubmitted(false)
    setError('')
  }

  const toggleCategory = (id) => {
    setCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const handleSendCode = async () => {
    if (!email) return
    setError('')
    setSending(true)
    try {
      await requestVerificationCode({ email })
      setCodeSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const handleVerify = async () => {
    if (!code) return
    setError('')
    setVerifying(true)
    try {
      await verifyCode({ email, verificationCode: code })
      setVerified(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setVerifying(false)
    }
  }

  const canSubmit = categories.length > 0 && verified && agreed && !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setError('')
    setSubmitting(true)
    try {
      await subscribe({
        email,
        academicNotice: categories.includes('academic'),
        employmentNotice: categories.includes('career'),
        privacyConsent: agreed,
      })
      setSubmitted(true)
      setToastMessage('신청이 완료되었습니다🎉')
      setShowToast(true)
      document.getElementById('subscribe-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="notice-subscribe">
      <PageHero photo photoSrc={heroNotice} title={['공지사항']} />

      <div className="container page-layout">
        <nav className="chapter-nav notice__filter-nav" aria-label="공지사항 분류">
          <p className="chapter-nav__label">ON THIS PAGE</p>
          <ul className="chapter-nav__list">
            {FILTERS.map((f) => (
              <li key={f.key}>
                <span className="chapter-nav__bar" />
                <Link to={`/notice?filter=${f.key}`}>{f.label}</Link>
              </li>
            ))}
            <li className="is-active">
              <span className="chapter-nav__bar" />
              <Link to="/notice/subscribe">공지 알림 신청</Link>
            </li>
          </ul>
        </nav>

        <main className="page-layout__main">
          <section id="subscribe-form" className="page-section">
            <h2>공지 알림 설정</h2>

            {submitted ? (
              <div className="notice-subscribe__done" role="status">
                <span className="notice-subscribe__done-icon" aria-hidden="true">✓</span>
                <p className="notice-subscribe__done-title">공지 알림 신청이 완료되었습니다</p>
                <p className="notice-subscribe__done-email">{email}</p>
                <p className="notice-subscribe__done-categories">
                  {CATEGORIES.filter((c) => categories.includes(c.id))
                    .map((c) => c.label)
                    .join(' · ')}{' '}
                  알림을 받습니다
                </p>
                <p className="notice-subscribe__done-text">
                  신청 완료 안내 메일을 보냈습니다. 메일이 보이지 않으면 스팸함을 확인해주세요.
                  <br />
                  알림은 메일 하단의 취소 링크로 언제든지 해지할 수 있습니다.
                </p>
                <div className="notice-subscribe__done-actions">
                  <Link to="/notice" className="notice-subscribe__done-btn notice-subscribe__done-btn--primary">
                    공지사항 보러가기
                  </Link>
                  <button type="button" className="notice-subscribe__done-btn" onClick={resetForm}>
                    다른 이메일로 신청하기
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={
                  SUBSCRIBE_READY
                    ? 'notice-subscribe__form-wrap'
                    : 'notice-subscribe__form-wrap notice-subscribe__form-wrap--paused'
                }
              >
                <div className="notice-subscribe__form" inert={!SUBSCRIBE_READY}>
                  <p className="notice-subscribe__form-title">받을 공지를 선택해주세요</p>
                  <div className="notice-subscribe__divider" />

                  <div className="notice-subscribe__row">
                    <div className="notice-subscribe__row-label">
                      <p>알림 받을 공지</p>
                      <span>* 중복 선택 가능</span>
                    </div>
                    <div className="notice-subscribe__row-content">
                      <div className="notice-subscribe__categories">
                        {CATEGORIES.map((c) => {
                          const active = categories.includes(c.id)
                          return (
                            <button
                              key={c.id}
                              type="button"
                              className={
                                active
                                  ? 'notice-subscribe__category notice-subscribe__category--active'
                                  : 'notice-subscribe__category'
                              }
                              onClick={() => toggleCategory(c.id)}
                              aria-pressed={active}
                            >
                              <span className="notice-subscribe__category-box" aria-hidden="true">
                                {active ? '✓' : ''}
                              </span>
                              <span className="notice-subscribe__category-label">{c.label}</span>
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
                                : 'notice-subscribe__side-btn notice-subscribe__side-btn--primary-outline'
                            }
                            onClick={handleVerify}
                            disabled={!codeSent || !code || verified || verifying}
                          >
                            {verifying ? '확인 중...' : verified ? '인증 완료' : '인증하기'}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <p className="notice-subscribe__hint notice-subscribe__hint--error" role="alert">
                          {error}
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
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                    >
                      {submitting ? '신청 중...' : submitted ? '알림 신청 완료' : '알림 신청하기'}
                    </button>
                  </div>
                </div>
                {!SUBSCRIBE_READY && (
                  <div className="notice-subscribe__paused" role="status">
                    <p className="notice-subscribe__paused-title">준비 중인 기능입니다</p>
                    <p className="notice-subscribe__paused-text">
                      공지 알림 메일 발송 설정이 완료되는 대로 신청을 받을 예정입니다.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>

      {showToast && (
        <div className="notice-subscribe__toast" role="status">
          {toastMessage}
        </div>
      )}

      {unsubscribeEmail && (
        <div className="notice-subscribe__dialog-backdrop">
          <div
            className="notice-subscribe__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="unsubscribe-title"
          >
            <p id="unsubscribe-title" className="notice-subscribe__dialog-title">
              알림 신청을 취소하시겠습니까?
            </p>
            <p className="notice-subscribe__dialog-email">{unsubscribeEmail}</p>
            <p className="notice-subscribe__dialog-text">
              취소하면 이 이메일로 공지 알림이 더 이상 발송되지 않습니다.
            </p>
            {unsubscribeError && (
              <p className="notice-subscribe__hint notice-subscribe__hint--error" role="alert">
                {unsubscribeError}
              </p>
            )}
            <div className="notice-subscribe__dialog-actions">
              <button
                type="button"
                className="notice-subscribe__dialog-btn"
                onClick={closeUnsubscribe}
                disabled={unsubscribing}
              >
                닫기
              </button>
              <button
                type="button"
                className="notice-subscribe__dialog-btn notice-subscribe__dialog-btn--primary"
                onClick={handleUnsubscribe}
                disabled={unsubscribing}
              >
                {unsubscribing ? '취소 중...' : '알림 신청 취소'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
