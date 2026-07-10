import { apiFetch } from "@/lib/api/fetchClient"
import { isMockEnabled } from "@/lib/env/isMockEnabled"
import { mockDashboardData } from "@/features/dashboard/data/mockDashboardData"

const USE_MOCK = isMockEnabled("NEXT_PUBLIC_USE_DASHBOARD_MOCK")

export async function getDashboardData({ receiptMonths = 6 } = {}) {
  if (USE_MOCK) {
    return mockDashboardData
  }

  const query = new URLSearchParams({
    receiptMonths: String(receiptMonths),
  })

  return apiFetch(`/api/dashboard?${query.toString()}`, {
    cache: "no-store",
  })
}
