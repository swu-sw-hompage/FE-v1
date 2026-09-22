import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ScrollToTop from '../components/common/ScrollToTop'

export default function MainLayout() {
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
