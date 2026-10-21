import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__top">
          <div className="footer__info">
            <strong>서울여자대학교 소프트웨어학과</strong>
            <p>서울특별시 노원구 화랑로 621 서울여자대학교</p>
            <p>TEL: 02-970-5921, FAX: 02-978-5981</p>
          </div>
          <p className="footer__copyright">
            © {new Date().getFullYear()} Seoul Women&apos;s University Department of Software. All
            rights reserved.
          </p>
        </div>
        <div className="footer__divider" />
        <nav className="footer__nav">
          <a
            href="https://www.swu.ac.kr/swu/1700/subview.do"
            target="_blank"
            rel="noreferrer"
            className="footer__link"
          >
            개인정보처리방침
          </a>
          <Link to="/about/location" className="footer__link">
            찾아오시는 길
          </Link>
          <a
            href="https://www.swu.ac.kr/sites/swu/index.do"
            target="_blank"
            rel="noreferrer"
            className="footer__link"
          >
            서울여자대학교
          </a>
        </nav>
      </div>
    </footer>
  )
}
