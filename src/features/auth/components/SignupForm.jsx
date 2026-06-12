"use client"

import { useState } from "react"
import { signup } from "@/features/auth/api/authApi"
import {
  AuthFormLayout,
  AuthInput,
  AuthMessage,
  AuthSubmitButton,
} from "@/features/auth/components/AuthFormLayout"

const initialForm = {
  loginId: "",
  password: "",
  userName: "",
  email: "",
  phone: "",
}

export default function SignupForm() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      await signup({
        loginId: form.loginId.trim(),
        password: form.password,
        userName: form.userName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      })
      setForm(initialForm)
      setMessage("가입 신청이 완료되었습니다. 관리자의 승인 후 로그인할 수 있습니다.")
    } catch (signupError) {
      setError(signupError.message || "회원가입에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthFormLayout
      title="회원가입"
      description="가입 신청 후 관리자가 계정을 승인합니다."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthInput
          id="loginId"
          label="아이디"
          value={form.loginId}
          onChange={(event) => updateField("loginId", event.target.value)}
          placeholder="로그인 아이디"
        />
        <AuthInput
          id="password"
          label="비밀번호"
          type="password"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
          placeholder="8자 이상 입력"
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

        <AuthSubmitButton loading={loading} loadingText="신청 중">
          가입 신청
        </AuthSubmitButton>
      </form>
    </AuthFormLayout>
  )
}
