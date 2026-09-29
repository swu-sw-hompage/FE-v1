import { useEffect } from 'react'
import './AdminToast.css'

export default function AdminToast({ message, onClose, duration = 2600 }) {
  useEffect(() => {
    if (!message) return undefined
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  return (
    <div className="admin-toast" role="status">
      {message}
    </div>
  )
}
