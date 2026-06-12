"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  requestFindLoginIdCode,
  verifyFindLoginIdCode,
} from "@/features/auth/api/authApi"
import {
  AuthFormLayout,
  AuthInput,
  AuthMessage,
  AuthSubmitButton,
} from "@/features/auth/components/AuthFormLayout"

const initialForm = {
  userName: "",
  email: "",
  phone: "",
  code: "",
}

export default function FindLoginIdForm() {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [verification, setVerification] = useState(null)
  const [loginId, setLoginId] = useState("")
  const [showResultModal, setShowResultModal] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function resetFlow() {
    setVerification(null)
    setLoginId("")
    setShowResultModal(false)
    setError("")
    setMessage("")
    setForm((current) => ({ ...current, code: "" }))
  }

  async function handleRequestCode(event) {
    event.preventDefault()
    setError("")
    setLoginId("")
    setLoading(true)

    try {
      const result = await requestFindLoginIdCode({
        userName: form.userName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      })

      setVerification(result)
      setMessage("인증번호가 발송되었습니다. 개발 중에는 백엔드 콘솔의 [DEV MAIL] 로그를 확인하세요.")
    } catch (requestError) {
      setError(requestError.message || "인증번호 요청에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyCode(event) {
    event.preventDefault()
    setError("")
    setLoginId("")
    setLoading(true)

    try {
      const result = await verifyFindLoginIdCode({
        verificationId: verification.verificationId,
        code: form.code.trim(),
      })

      setLoginId(result.loginId)
      setShowResultModal(true)
      setMessage("아이디 확인이 완료되었습니다.")
    } catch (verifyError) {
      setError(verifyError.message || "인증번호 확인에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AuthFormLayout
        title="아이디 찾기"
        description="가입 정보 확인 후 이메일 인증번호를 입력하세요."
      >
      {!verification ? (
        <form className="space-y-4" onSubmit={handleRequestCode}>
          <AuthInput
            id="userName"
            label="이름"
            value={form.userName}
            onChange={(event) => updateField("userName", event.target.value)}
            placeholder="사용자 이름"
          />
          <AuthInput
            id="email"
            label="이메일"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="example@buyflow.com"
          />
          <AuthInput
            id="phone"
            label="연락처"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="01012345678"
          />

          <AuthMessage type="error">{error}</AuthMessage>
          <AuthMessage>{message}</AuthMessage>

          <AuthSubmitButton loading={loading} loadingText="발송 중">
            인증번호 받기
          </AuthSubmitButton>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleVerifyCode}>
          <AuthInput
            id="code"
            label="인증번호"
            value={form.code}
            onChange={(event) => updateField("code", event.target.value)}
            placeholder="6자리 인증번호"
          />

          <AuthMessage type="error">{error}</AuthMessage>
          <AuthMessage>{message}</AuthMessage>

          {!loginId && (
            <AuthSubmitButton loading={loading} loadingText="확인 중">
              인증번호 확인
            </AuthSubmitButton>
          )}

          <button
            type="button"
            onClick={resetFlow}
            className="h-10 w-full rounded-md border border-blue-100 text-[12px] font-bold text-blue-700 transition hover:bg-blue-50"
          >
          정보 다시 입력
        </button>
      </form>
      )}
      </AuthFormLayout>

      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-[360px] rounded-lg bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
              <span className="text-xl font-black">ID</span>
            </div>

            <p className="mt-5 text-[13px] font-bold text-blue-600">
              아이디 찾기 완료
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-slate-950">
              가입된 아이디입니다
            </h2>

            <div className="mt-5 rounded-md border border-blue-200 bg-blue-50 px-4 py-4 text-xl font-extrabold text-blue-700">
              {loginId}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowResultModal(false)}
                className="h-11 rounded-md border border-slate-200 text-[13px] font-bold text-slate-700 transition hover:bg-slate-50"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => router.replace("/login")}
                className="h-11 rounded-md bg-blue-600 text-[13px] font-bold text-white transition hover:bg-blue-700"
              >
                로그인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
