import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="not-found container">
      <h2>페이지를 찾을 수 없습니다</h2>
      <Link to="/">홈으로 돌아가기</Link>
    </section>
  )
}
