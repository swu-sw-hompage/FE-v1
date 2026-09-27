import { apiClient } from './client'

export const requestVerificationCode = ({ email }) =>
  apiClient.post('/notifications/verification-code', { email })

export const verifyCode = ({ email, verificationCode }) =>
  apiClient.post('/notifications/verify', { email, verificationCode })

export const subscribe = ({ email, academicNotice, employmentNotice, privacyConsent }) =>
  apiClient.post('/notifications/subscribe', {
    email,
    academicNotice,
    employmentNotice,
    privacyConsent,
  })

export const unsubscribe = ({ email }) =>
  apiClient.delete('/notifications/subscribe', { data: { email } })
