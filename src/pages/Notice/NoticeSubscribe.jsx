import { useEffect, useState } from 'react'
import PageHero from '../../components/common/PageHero'
import ChapterNav from '../../components/common/ChapterNav'
import { requestVerificationCode, verifyCode, subscribe } from '../../api/notification'
import heroNoticeSubscribe from '../../assets/images/brand/hero-notice-subscribe.jpg'
import './NoticeSubscribe.css'

const SECTIONS = [
  { id: 'subscribe-form', label: '공지 알림 신청' },
  { to: '/notice', label: '공지사항 바로가기', exact: true },
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

  useEffect(() => {
    if (!showToast) return undefined
    const timer = setTimeout(() => setShowToast(false), 2800)
    return () => clearTimeout(timer)
  }, [showToast])

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
      setShowToast(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="notice-subscribe">
      <PageHero photo photoSrc={heroNoticeSubscribe} title={['공식 알림 설정']} />

      <div className="container page-layout">
        <ChapterNav sections={SECTIONS} />

        <main className="page-layout__main">
          <section id="subscribe-form" className="page-section">
            <h2>공식 알림 설정</h2>

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
