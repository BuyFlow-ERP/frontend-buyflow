"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
  getCurrentUser,
  loadMe,
  loginAndSave,
  logout as logoutRequest,
  signup as signupRequest,
} from "@/features/auth/api/authApi"

const AuthContext = createContext(null)

const INITIAL_AUTH_STATE = {
  user: null,
  isAuthReady: false,
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(INITIAL_AUTH_STATE)

  useEffect(() => {
    let ignore = false

    async function restoreSession() {
      const savedUser = getCurrentUser()

      if (!savedUser) {
        if (!ignore) {
          setAuthState({ user: null, isAuthReady: true })
        }

        return
      }

      try {
        const freshUser = await loadMe()

        if (!ignore) {
          setAuthState({ user: freshUser, isAuthReady: true })
        }
      } catch {
        logoutRequest()

        if (!ignore) {
          setAuthState({ user: null, isAuthReady: true })
        }
      }
    }

    restoreSession()

    return () => {
      ignore = true
    }
  }, [])

  const auth = useMemo(
    () => ({
      user: authState.user,
      isLoggedIn: Boolean(authState.user),
      isAuthReady: authState.isAuthReady,

      async login(values) {
        const session = await loginAndSave(
          {
            loginId: values.loginId,
            password: values.password,
          },
          values.remember ?? true,
        )

        setAuthState({
          user: session.user,
          isAuthReady: true,
        })

        return session.user
      },

      logout() {
        logoutRequest()

        setAuthState({
          user: null,
          isAuthReady: true,
        })
      },

      signup: signupRequest,

      async refresh() {
        const freshUser = await loadMe()

        setAuthState({
          user: freshUser,
          isAuthReady: true,
        })

        return freshUser
      },
    }),
    [authState],
  )

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.")
  }

  return context
}
