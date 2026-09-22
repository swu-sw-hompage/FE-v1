import { useEffect, useState } from 'react'
import PageHero from '../../components/common/PageHero'
import ChapterNav from '../../components/common/ChapterNav'
import './NoticeSubscribe.css'

const SECTIONS = [{ id: 'subscribe-form', label: '공지 알림 신청' }]

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

  useEffect(() => {
    if (!showToast) return undefined
    const timer = setTimeout(() => setShowToast(false), 2800)
    return () => clearTimeout(timer)
  }, [showToast])

  const toggleCategory = (id) => {
    setCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  const handleSendCode = () => {
    if (!email) return
    setCodeSent(true)
  }

  const handleVerify = () => {
    if (!code) return
    setVerified(true)
  }

  const canSubmit = categories.length > 0 && verified && agreed

  const handleSubmit = () => {
    if (!canSubmit) return
    setSubmitted(true)
    setShowToast(true)
  }

  return (
    <div className="notice-subscribe">
      <PageHero
        tone="light"
        eyebrow="EMAIL NOTIFICATION"
        title={['새 공지 소식을', '이메일로 받아보세요']}
        subtitle="학과 공지사항이 올라오면 등록한 이메일로 알려드립니다."
      />

      <div className="container page-layout">
        <ChapterNav sections={SECTIONS} />

        <main className="page-layout__main">
          <section id="subscribe-form" className="page-section">
            <h2>공지 알림 신청</h2>
            <p className="notice-subscribe__lead">새 공지가 올라오면 이메일로 알려드릴게요.</p>

            <div className="notice-subscribe__card">
              <div className="notice-subscribe__card-head">
                <p className="notice-subscribe__card-title">이메일로 공지 받기</p>
                <p className="notice-subscribe__card-desc">
                  등록한 이메일로 학과 공지사항이 게시되었다는 소식을 보내드립니다.
                </p>
              </div>

              <div className="notice-subscribe__field">
                <p className="notice-subscribe__field-label">알림 받을 공지 유형</p>
                <p className="notice-subscribe__field-help">원하는 유형을 모두 선택할 수 있습니다.</p>
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
                        <span className="notice-subscribe__checkbox" />
                        {c.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="notice-subscribe__field">
                <p className="notice-subscribe__field-label">이메일 주소 *</p>
                <div className="notice-subscribe__row">
                  <input
                    type="email"
                    className="notice-subscribe__input"
                    placeholder="이메일을 입력해주세요"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setCodeSent(false)
                      setVerified(false)
                    }}
                  />
                  <button
                    type="button"
                    className="notice-subscribe__side-btn"
                    onClick={handleSendCode}
                    disabled={!email}
                  >
                    {codeSent ? '재전송' : '인증번호 받기'}
                  </button>
                </div>
                {codeSent && !verified && (
                  <p className="notice-subscribe__hint">인증번호를 이메일로 보냈습니다.</p>
                )}
              </div>

              <div className="notice-subscribe__field">
                <p className="notice-subscribe__field-label">인증번호 *</p>
                <div className="notice-subscribe__row">
                  <input
                    type="text"
                    className="notice-subscribe__input"
                    placeholder="6자리 인증번호를 입력해주세요"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={!codeSent || verified}
                  />
                  <button
                    type="button"
                    className={
                      verified
                        ? 'notice-subscribe__side-btn notice-subscribe__side-btn--done'
                        : 'notice-subscribe__side-btn notice-subscribe__side-btn--outline'
                    }
                    onClick={handleVerify}
                    disabled={!codeSent || !code || verified}
                  >
                    {verified ? '인증 완료' : '인증하기'}
                  </button>
                </div>
              </div>

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

              <p className="notice-subscribe__note">알림 신청은 언제든지 해지할 수 있습니다.</p>

              <button
                type="button"
                className="notice-subscribe__submit"
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                {submitted ? '알림 신청 완료' : '알림 신청하기 ↗'}
              </button>
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
