import AdminAccessGate from "@/features/admin/components/AdminAccessGate"
import AdminUserManagement from "@/features/admin/components/AdminUserManagement"

export const metadata = {
  title: "회원 승인 및 권한 관리 | BuyFlow ERP",
  description: "BuyFlow ERP 관리자 회원 승인 및 권한 관리",
}

export default function AdminUsersPage() {
  return (
    <AdminAccessGate>
      <AdminUserManagement />
    </AdminAccessGate>
  )
}
