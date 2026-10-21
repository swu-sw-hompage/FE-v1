import AdminLayout from '../../layouts/AdminLayout'
import { getAdminEmail } from '../../api/auth'
import './Admin.css'

const CONTACTS = [
  { label: '관리자 계정 담당자', email: 'thotemily@naver.com' },
  { label: '관리자 계정 담당자', email: 'j_yujin_swu22@naver.com' },
]

export default function AdminAccounts() {
  const adminEmail = getAdminEmail() ?? 'admin'

  return (
    <AdminLayout
      breadcrumb="관리자 계정"
      eyebrow="ACCOUNT"
      title="관리자 계정"
      description="학과 홈페이지는 하나의 관리자 계정으로 운영됩니다. 계정 추가·삭제·비밀번호 변경은 담당자를 통해서만 가능합니다."
    >
      <div className="admin-settings-card">
        <div className="admin-settings-row">
          <div className="admin-settings-row__desc">
            <p className="admin-settings-row__title">계정 정보</p>
            <p className="admin-settings-row__text">현재 로그인한 관리자 계정입니다.</p>
          </div>
          <div className="admin-settings-row__body">
            <div className="admin-account-profile">
              <span className="admin-account-profile__avatar">{adminEmail.charAt(0).toUpperCase()}</span>
              <div className="admin-account-profile__info">
                <p className="admin-account-profile__name">{adminEmail}</p>
                <p className="admin-account-profile__role">단일 관리자 계정</p>
              </div>
              <span className="admin-badge admin-badge--green">사용 중</span>
            </div>
          </div>
        </div>

        <div className="admin-divider" />

        <div className="admin-settings-row">
          <div className="admin-settings-row__desc">
            <p className="admin-settings-row__title">비밀번호 변경</p>
            <p className="admin-settings-row__text">
              보안을 위해 관리자 페이지에서는 비밀번호를 변경할 수 없습니다. 변경이 필요하면 담당자에게 메일로
              문의해주세요.
            </p>
          </div>
          <div className="admin-settings-row__body">
            <div className="admin-contacts">
              {CONTACTS.map((c) => (
                <div className="admin-contact-card" key={c.email}>
                  <span className="admin-contact-card__icon">✉</span>
                  <div className="admin-contact-card__info">
                    <p className="admin-contact-card__label">{c.label}</p>
                    <p className="admin-contact-card__email">{c.email}</p>
                  </div>
                  <a href={`mailto:${c.email}`} className="admin-btn admin-btn--outline admin-btn--sm">
                    메일 보내기
                  </a>
                </div>
              ))}
              <p className="admin-contacts__note">문의할 때 이름과 소속, 변경이 필요한 이유를 함께 적어주세요.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
