import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase()

export default function ProtectedRoute({ children }) {
  const { currentUser, loading, logout } = useAuth()
  const location = useLocation()
  const userEmail = currentUser?.email?.toLowerCase()
  const isAllowedAdmin = Boolean(currentUser && adminEmail && userEmail === adminEmail)
  const isWrongUser = Boolean(currentUser && !isAllowedAdmin)

  useEffect(() => {
    if (isWrongUser) {
      logout()
    }
  }, [isWrongUser, logout])

  if (loading) {
    return (
      <section className="page-section compact">
        <span className="eyebrow">Admin</span>
        <h1>Checking access</h1>
        <p>Please wait while we verify your admin session.</p>
      </section>
    )
  }

  if (!currentUser || isWrongUser) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  if (!isAllowedAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return children
}
