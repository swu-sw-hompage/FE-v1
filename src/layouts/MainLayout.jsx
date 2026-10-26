import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ScrollToTop from '../components/common/ScrollToTop'
import { trackVisit } from '../api/analytics'

export default function MainLayout() {
  // 관리자·개발자 페이지는 이 레이아웃 밖이라 방문으로 잡히지 않는다.
  useEffect(() => {
    trackVisit()
  }, [])

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Header />
      <main className="app-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
