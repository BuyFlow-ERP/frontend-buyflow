<<<<<<< HEAD
import SignupForm from "@/features/auth/components/SignupForm"

export const metadata = {
  title: "회원가입 | BuyFlow ERP",
  description: "BuyFlow ERP 회원가입",
}

export default function SignupPage() {
  return <SignupForm />
=======
import AuthFormPage from "@/features/auth/components/AuthFormPage"
import AuthShell from "@/features/auth/components/AuthShell"

export const metadata = {
  title: "회원가입 | 물류 ERP 시스템",
}

export default function SignupPage() {
  return (
    <AuthShell>
      <AuthFormPage mode="signup" />
    </AuthShell>
  )
>>>>>>> 4f9c7b07b196d47779f7048df65a566b50f79c8f
}
