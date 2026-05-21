import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase()

function getLoginErrorMessage(error) {
  const code = error?.code || ''

  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/user-not-found' ||
    code === 'auth/wrong-password'
  ) {
    return 'Invalid email or password. Please check your admin login details and try again.'
  }

  if (code === 'auth/too-many-requests') {
    return 'Too many failed login attempts. Please wait a moment, then try again.'
  }

  if (code === 'auth/network-request-failed') {
    return 'Network error. Please check your internet connection and try again.'
  }

  if (error?.message === 'This account is not allowed to access the admin dashboard.') {
    return error.message
  }

  return 'Unable to sign in right now. Please try again.'
}

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { currentUser, loading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'
  const isAllowedAdmin = currentUser?.email?.toLowerCase() === adminEmail

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(getLoginErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!loading && isAllowedAdmin) {
    return <Navigate to="/admin" replace />
  }

  return (
    <section className="page-section page-fill compact">
      <span className="eyebrow">Admin login</span>
      <h1>DSCENT.NG admin</h1>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@dscent.ng"
            required
            type="email"
            value={email}
          />
        </label>
        <label>
          Password
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
            type="password"
            value={password}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="button primary" disabled={isSubmitting || loading} type="submit">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </section>
  )
}
