import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import promoImage from '../../assets/images/promo/notice-subscribe-popup.jpg'
import { trackPromo } from '../../api/analytics'
import './PromoPopup.css'

// 공지 알림 신청 홍보 팝업 (홈 첫 화면).
// SHOW_UNTIL이 지나면 저절로 안 뜬다. 다음 홍보 때는 이미지·링크·날짜·키만 바꾸면 된다.
// 노출·클릭은 key 이름으로 /dev/stats의 홍보 팝업 카드에 집계된다.
const PROMO = {
  key: 'notice-subscribe-2026-10',
  image: promoImage,
  alt: '공지 알림 신청 — 새 공지가 올라오면 학교 메일로 먼저 알려드려요',
  to: '/notice/subscribe',
}
const SHOW_UNTIL = new Date('2026-11-04T23:59:59+09:00')
const HIDE_KEY = 'swu_promo_hidden_until'

const isHidden = () => {
  if (Date.now() > SHOW_UNTIL.getTime()) return true
  try {
    const saved = JSON.parse(localStorage.getItem(HIDE_KEY))
    return saved?.key === PROMO.key && Date.now() < saved.until
  } catch {
    return false
  }
}

// 오늘 하루 보지 않기: 다음 날 0시까지 숨긴다.
const hideForToday = () => {
  const tomorrow = new Date()
  tomorrow.setHours(24, 0, 0, 0)
  try {
    localStorage.setItem(HIDE_KEY, JSON.stringify({ key: PROMO.key, until: tomorrow.getTime() }))
  } catch {
    // 저장 못 해도 이번 화면에서는 닫힌다.
  }
}

export default function PromoPopup() {
  const [open, setOpen] = useState(() => !isHidden())
  const navigate = useNavigate()

  // 홈에 들어올 때마다 뜨므로 노출 수는 방문보다 많을 수 있다. 통계에는 본 사람 수도 같이 나온다.
  useEffect(() => {
    if (open) trackPromo('PROMO_VIEW', PROMO.key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!open) return null

  const goToPromo = () => {
    trackPromo('PROMO_CLICK', PROMO.key)
    setOpen(false)
    navigate(PROMO.to)
  }

  const closeForToday = () => {
    hideForToday()
    setOpen(false)
  }

  return (
    <div className="promo-popup" role="dialog" aria-modal="true" aria-label="공지 알림 신청 안내" onClick={() => setOpen(false)}>
      <div className="promo-popup__panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="promo-popup__image-btn" onClick={goToPromo}>
          <img src={PROMO.image} alt={PROMO.alt} className="promo-popup__image" width="1080" height="1350" />
        </button>
        <div className="promo-popup__actions">
          <button type="button" className="promo-popup__action" onClick={closeForToday}>
            오늘 하루 보지 않기
          </button>
          <button type="button" className="promo-popup__action promo-popup__action--close" onClick={() => setOpen(false)}>
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
