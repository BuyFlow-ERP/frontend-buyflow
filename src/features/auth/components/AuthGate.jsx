"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { loadMe } from "@/features/auth/api/authApi"
import { clearAuthSession, getAccessToken } from "@/features/auth/utils/authStorage"

function withTimeout(promise, timeoutMs = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(
        () => reject(new Error("인증 확인 시간이 초과되었습니다.")),
        timeoutMs,
      )
    }),
  ])
}

export default function AuthGate({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true

    async function verifySession() {
      if (!getAccessToken()) {
        clearAuthSession()
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
        return
      }

      try {
        await withTimeout(loadMe())
        if (mounted) {
          setReady(true)
        }
      } catch {
        clearAuthSession()
        router.replace("/login")
      }
    }

    verifySession()

    return () => {
      mounted = false
    }
  }, [pathname, router])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-[13px] font-medium text-slate-500">
        인증 정보를 확인하는 중입니다.
      </div>
    )
  }

  return children
}
