import { useState } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import './Admin.css'

const ACCOUNTS = [
  { id: 'root-admin', role: 'ROOT ADMIN', active: true },
  { id: 'swu-admin01', role: 'ADMIN', active: true },
  { id: 'swu-admin02', role: 'ADMIN', active: false },
]

export default function AdminAccounts() {
  const [form, setForm] = useState({ id: '', password: '', confirm: '' })

  return (
    <AdminLayout title="관리자 계정 관리">
      <p className="admin-page__title">관리자 계정 관리</p>
      <p className="admin-page__desc">Root 관리자만 새로운 관리자 계정을 추가하거나 비활성화할 수 있습니다.</p>

      <div className="admin-banner">
        <p className="admin-banner__label">ROOT ADMIN</p>
        <p className="admin-banner__text">현재 계정: root-admin · 모든 관리자 계정 관리 권한 보유</p>
      </div>

      <div className="admin-accounts-grid">
        <div className="admin-card admin-add-admin">
          <h2 className="admin-card__title">새 관리자 추가</h2>
          <p className="admin-card__subtitle">관리자 계정은 아이디와 비밀번호로만 로그인합니다.</p>

          <form
            className="admin-form"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <label className="admin-field">
              <span>관리자 아이디 *</span>
              <input
                type="text"
                placeholder="아이디를 입력해주세요"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
              />
            </label>
            <label className="admin-field">
              <span>비밀번호 *</span>
              <input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>
            <label className="admin-field">
              <span>비밀번호 확인 *</span>
              <input
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
            </label>

            <button type="submit" className="admin-btn admin-btn--primary admin-btn--block">
              관리자 추가
            </button>
            <p className="admin-form__note">※ Root 관리자만 계정을 추가할 수 있습니다.</p>
          </form>
        </div>

        <div className="admin-card admin-account-list">
          <div className="admin-card__head">
            <h2>등록된 관리자</h2>
            <span className="admin-account-list__count">{ACCOUNTS.length}명</span>
          </div>
          <div className="admin-account-rows">
            {ACCOUNTS.map((a) => (
              <div className="admin-account-row" key={a.id}>
                <div>
                  <p className="admin-account-row__id">{a.id}</p>
                  <p className="admin-account-row__role">{a.role}</p>
                </div>
                <span
                  className={
                    a.active
                      ? 'admin-account-row__status admin-account-row__status--active'
                      : 'admin-account-row__status'
                  }
                >
                  {a.active ? '활성' : '비활성'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-policy">
        <p className="admin-policy__title">관리자 계정 운영 원칙</p>
        <p>Root 관리자 계정은 최초 1개로 운영하며, 추가된 관리자는 공지사항·졸업작품 관리만 수행할 수 있습니다.</p>
        <p>Root 관리자 권한은 다른 관리자에게 위임하지 않습니다.</p>
      </div>
    </AdminLayout>
  )
}
