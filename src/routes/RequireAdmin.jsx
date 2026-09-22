import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../api/auth'

export default function RequireAdmin({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}
