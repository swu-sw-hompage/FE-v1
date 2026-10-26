import { Link } from 'react-router-dom'
import EmptyState from '../../components/common/EmptyState'
import './NotFound.css'

const SHORTCUTS = [
  { to: '/about', label: '학과 소개', desc: '학과 개요와 연혁, 졸업 후 진로' },
  { to: '/curriculum', label: '교육과정', desc: '교육과정, 전공로드맵, 졸업 요건' },
  { to: '/faculty', label: '교수진', desc: '교수님 소개와 연구 분야' },
  { to: '/notice', label: '공지사항', desc: '학사·취업 공지와 알림 신청' },
]

export default function NotFound() {
  return (
    <section className="not-found container">
      <EmptyState
        size="large"
        title="페이지를 찾을 수 없습니다"
        description="주소가 잘못 입력되었거나 페이지가 옮겨졌을 수 있어요."
        actions={[{ label: '홈으로 가기', to: '/' }]}
      />

      <p className="not-found__label">바로가기</p>
      <ul className="not-found__links">
        {SHORTCUTS.map((item) => (
          <li key={item.to}>
            <Link to={item.to}>
              <strong>{item.label}</strong>
              <span>{item.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
