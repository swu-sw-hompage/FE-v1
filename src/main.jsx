// 예전 홈페이지 주소면 라우터가 만들어지기 전에 새 주소로 바꾼다 (반드시 App보다 먼저).
import './utils/legacyRedirect'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
