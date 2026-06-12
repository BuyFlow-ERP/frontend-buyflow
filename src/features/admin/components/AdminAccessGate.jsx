"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ShieldAlert } from "lucide-react"
import { loadMe } from "@/features/auth/api/authApi"

function hasAdminAccess(session) {
  const roles = session?.roles ?? []
  const permissions = session?.permissions ?? []

  return roles.includes("ADMIN") || permissions.includes("USER_MANAGE")
}

export default function AdminAccessGate({ children }) {
  const [allowed, setAllowed] = useState(null)

  useEffect(() => {
    let ignore = false

    async function verifyAdminAccess() {
      try {
        const session = await loadMe()

        if (!ignore) {
          setAllowed(hasAdminAccess(session))
        }
      } catch {
        if (!ignore) {
          setAllowed(false)
        }
      }
    }

    verifyAdminAccess()

    return () => {
      ignore = true
    }
  }, [])

  if (allowed === null) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 text-center text-[12px] font-medium text-slate-500 shadow-sm">
        관리자 권한을 확인하는 중입니다.
      </div>
    )
  }

  if (!allowed) {
    return (
      <section className="rounded-lg border border-amber-100 bg-white p-6 text-center shadow-sm">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <ShieldAlert size={21} />
        </span>
        <h1 className="mt-4 text-[18px] font-bold text-slate-900">
          관리자 권한이 필요합니다.
        </h1>
        <p className="mt-2 text-[12px] text-slate-500">
          회원 승인과 권한 관리는 관리자 계정으로만 접근할 수 있습니다.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-flex h-9 items-center justify-center rounded-md border border-slate-200 px-4 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          대시보드로 돌아가기
        </Link>
      </section>
    )
  }

  return children
}
