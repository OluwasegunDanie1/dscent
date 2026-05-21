import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../services/firebase.js'

const AuthContext = createContext(null)
const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const signedInEmail = user?.email?.toLowerCase()

      if (user && (!adminEmail || signedInEmail !== adminEmail)) {
        await signOut(auth)
        setCurrentUser(null)
        setLoading(false)
        return
      }

      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = useCallback(async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const signedInEmail = credential.user.email?.toLowerCase()

    if (!adminEmail || signedInEmail !== adminEmail) {
      await signOut(auth)
      throw new Error('This account is not allowed to access the admin dashboard.')
    }

    return credential.user
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      login,
      logout,
    }),
    [currentUser, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
