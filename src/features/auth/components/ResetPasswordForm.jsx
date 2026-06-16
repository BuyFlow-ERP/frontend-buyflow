"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  confirmPasswordReset,
  requestPasswordResetCode,
  verifyPasswordResetCode,
} from "@/features/auth/api/authApi"
import {
  AuthFormLayout,
  AuthInput,
  AuthMessage,
  AuthSubmitButton,
} from "@/features/auth/components/AuthFormLayout"

const initialForm = {
  loginId: "",
  userName: "",
  email: "",
  phone: "",
  code: "",
  newPassword: "",
}

export default function ResetPasswordForm() {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [verification, setVerification] = useState(null)
  const [resetProof, setResetProof] = useState(null)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function resetFlow() {
    setVerification(null)
    setResetProof(null)
    setError("")
    setMessage("")
    setForm((current) => ({ ...current, code: "", newPassword: "" }))
  }

  async function handleRequestCode(event) {
    event.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const result = await requestPasswordResetCode({
        loginId: form.loginId.trim(),
        userName: form.userName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      })

      setVerification(result)
      setMessage(
        "인증번호가 발송되었습니다. 개발 중에는 백엔드 콘솔의 [DEV MAIL] 로그를 확인하세요.",
      )
    } catch (requestError) {
      setError(requestError.message || "인증번호 요청에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyCode(event) {
    event.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const result = await verifyPasswordResetCode({
        verificationId: verification.verificationId,
        code: form.code.trim(),
      })

      setResetProof(result)
      setMessage("이메일 인증이 완료되었습니다. 새 비밀번호를 입력하세요.")
    } catch (verifyError) {
      setError(verifyError.message || "인증번호 확인에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirmReset(event) {
    event.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      await confirmPasswordReset({
        resetTokenId: resetProof.resetTokenId,
        resetToken: resetProof.resetToken,
        newPassword: form.newPassword,
      })

      setForm(initialForm)
      setVerification(null)
      setResetProof(null)
      router.replace("/login")
    } catch (confirmError) {
      setError(confirmError.message || "비밀번호 재설정에 실패했습니다.")
      setLoading(false)
    }
  }

  return (
    <AuthFormLayout
      title="비밀번호 재설정"
      description="이메일 인증 후 새 비밀번호를 설정하세요."
    >
      {!verification && !resetProof && (
        <form className="space-y-4" onSubmit={handleRequestCode}>
          <AuthInput
            id="loginId"
            label="아이디"
            value={form.loginId}
            onChange={(event) => updateField("loginId", event.target.value)}
            placeholder="로그인 아이디"
          />
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
      )}

      {verification && !resetProof && (
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

          <AuthSubmitButton loading={loading} loadingText="확인 중">
            인증번호 확인
          </AuthSubmitButton>

          <button
            type="button"
            onClick={resetFlow}
            className="h-10 w-full rounded-md border border-blue-100 text-[12px] font-bold text-blue-700 transition hover:bg-blue-50"
          >
            정보 다시 입력
          </button>
        </form>
      )}

      {resetProof && (
        <form className="space-y-4" onSubmit={handleConfirmReset}>
          <AuthInput
            id="newPassword"
            label="새 비밀번호"
            type="password"
            value={form.newPassword}
            onChange={(event) => updateField("newPassword", event.target.value)}
            placeholder="8자 이상 입력"
          />

          <AuthMessage type="error">{error}</AuthMessage>
          <AuthMessage>{message}</AuthMessage>

          <AuthSubmitButton loading={loading} loadingText="재설정 중">
            비밀번호 재설정
          </AuthSubmitButton>
        </form>
      )}
    </AuthFormLayout>
  )
}
