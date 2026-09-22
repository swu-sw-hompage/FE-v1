import { apiClient } from './client'

export const requestVerificationCode = ({ studentNo, name, email }) =>
  apiClient.post('/notifications/verification-code', { studentNo, name, email })

export const verifyCode = ({ studentNo, email, verificationCode }) =>
  apiClient.post('/notifications/verify', { studentNo, email, verificationCode })

export const subscribe = ({ studentNo, name, email, academicNotice, employmentNotice, privacyConsent }) =>
  apiClient.post('/notifications/subscribe', {
    studentNo,
    name,
    email,
    academicNotice,
    employmentNotice,
    privacyConsent,
  })

export const unsubscribe = ({ studentNo, email }) =>
  apiClient.delete('/notifications/subscribe', { data: { studentNo, email } })
