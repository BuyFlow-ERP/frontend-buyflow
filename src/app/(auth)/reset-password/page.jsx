<<<<<<< HEAD
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm"

export const metadata = {
  title: "비밀번호 재설정 | BuyFlow ERP",
  description: "BuyFlow ERP 비밀번호 재설정",
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
=======
import AuthFormPage from "@/features/auth/components/AuthFormPage"
import AuthShell from "@/features/auth/components/AuthShell"

export const metadata = {
  title: "비밀번호 재설정 | 물류 ERP 시스템",
}

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <AuthFormPage mode="reset-password" />
    </AuthShell>
  )
>>>>>>> 4f9c7b07b196d47779f7048df65a566b50f79c8f
}
