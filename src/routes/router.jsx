import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home/Home'
import About from '../pages/About/About'
import History from '../pages/About/History'
import EducationGoals from '../pages/About/EducationGoals'
import CareerDetail from '../pages/About/CareerDetail'
import Location from '../pages/About/Location'
import Curriculum from '../pages/Curriculum/Curriculum'
import Roadmap from '../pages/Curriculum/Roadmap'
import Requirements from '../pages/Curriculum/Requirements'
import Faculty from '../pages/Faculty/Faculty'
import Activities from '../pages/Activities/Activities'
import ActivityDetail from '../pages/Activities/ActivityDetail'
import Notice from '../pages/Notice/Notice'
import NoticeDetail from '../pages/Notice/NoticeDetail'
import NoticeSubscribe from '../pages/Notice/NoticeSubscribe'
import Login from '../pages/Login/Login'
import NotFound from '../pages/NotFound/NotFound'
import Dashboard from '../pages/Admin/Dashboard'
import AdminAccounts from '../pages/Admin/AdminAccounts'
import AdminNoticeList from '../pages/Admin/AdminNoticeList'
import AdminCapstoneList from '../pages/Admin/AdminCapstoneList'
import AdminSubscribers from '../pages/Admin/AdminSubscribers'
import NoticeWrite from '../pages/Admin/NoticeWrite'
import CapstoneWrite from '../pages/Admin/CapstoneWrite'
import DevStats from '../pages/Dev/DevStats'
import RequireAdmin from './RequireAdmin'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'about/history', element: <History /> },
      { path: 'about/education-goals', element: <EducationGoals /> },
      { path: 'about/career', element: <Navigate to="/about/career/server-cloud" replace /> },
      { path: 'about/career/:slug', element: <CareerDetail /> },
      { path: 'about/location', element: <Location /> },
      { path: 'curriculum', element: <Curriculum /> },
      { path: 'curriculum/roadmap', element: <Roadmap /> },
      { path: 'curriculum/requirements', element: <Requirements /> },
      { path: 'faculty', element: <Faculty /> },
      { path: 'activities', element: <Navigate to="/activities/2025" replace /> },
      { path: 'activities/:year', element: <Activities /> },
      { path: 'activities/:year/:id', element: <ActivityDetail /> },
      { path: 'notice', element: <Notice /> },
      { path: 'notice/subscribe', element: <NoticeSubscribe /> },
      { path: 'notice/:id', element: <NoticeDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '/login', element: <Login /> },
  // 개발자용 통계. 메뉴에는 없고 주소로만 들어간다 (접근 키 필요).
  { path: '/dev/stats', element: <DevStats /> },
  { path: '/admin', element: <RequireAdmin><Dashboard /></RequireAdmin> },
  { path: '/admin/accounts', element: <RequireAdmin><AdminAccounts /></RequireAdmin> },
  { path: '/admin/subscribers', element: <RequireAdmin><AdminSubscribers /></RequireAdmin> },
  { path: '/admin/notices', element: <RequireAdmin><AdminNoticeList /></RequireAdmin> },
  { path: '/admin/notices/new', element: <RequireAdmin><NoticeWrite /></RequireAdmin> },
  { path: '/admin/notices/:id/edit', element: <RequireAdmin><NoticeWrite /></RequireAdmin> },
  { path: '/admin/capstone', element: <RequireAdmin><AdminCapstoneList /></RequireAdmin> },
  { path: '/admin/capstone/new', element: <RequireAdmin><CapstoneWrite /></RequireAdmin> },
  { path: '/admin/capstone/:id/edit', element: <RequireAdmin><CapstoneWrite /></RequireAdmin> },
])
