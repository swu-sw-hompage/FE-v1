import { Link } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import './Admin.css'

const RECENT_NOTICES = [
  { id: 1, title: '2027학년도 AI·데이터 신규 트랙 교육과정 설명회 안내', date: '2026.08.06', status: '게시' },
  { id: 2, title: '소프트웨어융합학과 명칭 변경 및 학사 안내', date: '2026.07.28', status: '게시' },
  { id: 3, title: '2026 하계 캡스톤 프로젝트 결과 발표회', date: '2026.07.15', status: '게시' },
  { id: 4, title: '신입생 오리엔테이션 일정 안내', date: '2026.06.20', status: '임시저장' },
]

const RECENT_PROJECTS = [
  { year: 2025, title: 'AI·데이터 서비스', count: 12 },
  { year: 2024, title: '캠퍼스 생활 개선', count: 9 },
  { year: 2023, title: '새로운 기술 탐구', count: 8 },
]

export default function Dashboard() {
  return (
    <AdminLayout title="관리자 대시보드">
      <p className="admin-page__title">안녕하세요, 김관리자님</p>
      <p className="admin-page__desc">오늘의 학과 홈페이지 운영 현황을 확인하세요.</p>

      <div className="admin-kpis">
        <div className="admin-kpi admin-kpi--pink">
          <p className="admin-kpi__label">게시된 공지사항</p>
          <p className="admin-kpi__value">24</p>
          <p className="admin-kpi__meta">이번 달 +3</p>
        </div>
        <div className="admin-kpi">
          <p className="admin-kpi__label">등록된 졸업작품</p>
          <p className="admin-kpi__value">38</p>
          <p className="admin-kpi__meta">2020–2025</p>
        </div>
        <div className="admin-kpi admin-kpi--blue">
          <p className="admin-kpi__label">알림 신청자</p>
          <p className="admin-kpi__value">186</p>
          <p className="admin-kpi__meta">인증 완료 172명</p>
        </div>
        <div className="admin-kpi">
          <p className="admin-kpi__label">검토 대기</p>
          <p className="admin-kpi__value">3</p>
          <p className="admin-kpi__meta">확인 필요</p>
        </div>
      </div>

      <div className="admin-card admin-card--notices">
        <div className="admin-card__head">
          <h2>최근 공지사항</h2>
          <Link to="/admin/notices/new" className="admin-btn admin-btn--primary admin-btn--sm">
            공지 작성
          </Link>
        </div>
        <div className="admin-notice-rows">
          {RECENT_NOTICES.map((n) => (
            <div className="admin-notice-row" key={n.id}>
              <p>{n.title}</p>
              <span className="admin-notice-row__date">{n.date}</span>
              <span
                className={
                  n.status === '게시'
                    ? 'admin-notice-row__status admin-notice-row__status--live'
                    : 'admin-notice-row__status admin-notice-row__status--draft'
                }
              >
                {n.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">최근 졸업작품</h2>
        <div className="admin-project-grid">
          {RECENT_PROJECTS.map((p) => (
            <div className="admin-project-card" key={p.year}>
              <p className="admin-project-card__year">{p.year}</p>
              <p className="admin-project-card__title">{p.title}</p>
              <p className="admin-project-card__count">{p.count}개 작품</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
