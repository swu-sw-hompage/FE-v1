import axios from 'axios'

// 백엔드(Spring Boot) 주소는 .env의 VITE_API_BASE_URL로 주입
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 백엔드는 모든 응답을 { isSuccess, code, message, result } 형태로 감싸서 내려준다.
// 응답에서는 result만 꺼내고, 실패 응답은 message가 담긴 Error로 통일해서 던진다.
apiClient.interceptors.response.use(
  (response) => response.data?.result,
  (error) => {
    // 관리자 API가 401이면 토큰이 만료됐거나 무효다. 로그인 요청 자체의 실패(비밀번호 오류)는 제외.
    const url = error.config?.url ?? ''
    if (error.response?.status === 401 && url.startsWith('/admin') && !url.startsWith('/admin/auth/login')) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('adminEmail')
      window.dispatchEvent(new Event('admin-session-expired'))
    }
    const message = error.response?.data?.message ?? error.message ?? '요청 처리 중 오류가 발생했습니다.'
    return Promise.reject(new Error(message))
  },
)
