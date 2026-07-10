import { getRequestStatusClassName } from "@/constants/purchaseRequestStatus"

export function formatWon(value = 0) {
  return `${Number(value).toLocaleString("ko-KR")}원`
}

export function formatDateTime(value) {
  if (!value) return "-"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

export function calculateTotalAmount(items = []) {
  return items.reduce(
    (total, item) => total + Number(item.expectedAmount ?? 0),
    0,
  )
}

export function getRequestStatusStyle(statusCode) {
  return getRequestStatusClassName(statusCode)
}
