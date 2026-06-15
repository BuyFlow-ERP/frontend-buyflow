<<<<<<< HEAD
import LoginForm from "@/features/auth/components/LoginForm"
=======
import AuthFormPage from "@/features/auth/components/AuthFormPage"
import AuthShell from "@/features/auth/components/AuthShell"
>>>>>>> 4f9c7b07b196d47779f7048df65a566b50f79c8f

export const metadata = {
  title: "로그인 | BuyFlow ERP",
  description: "BuyFlow 구매관리 ERP 로그인",
}

export default function LoginPage() {
<<<<<<< HEAD
  return <LoginForm />
=======
  return (
    <AuthShell>
      <AuthFormPage mode="login" />
    </AuthShell>
  )
>>>>>>> 4f9c7b07b196d47779f7048df65a566b50f79c8f
}
