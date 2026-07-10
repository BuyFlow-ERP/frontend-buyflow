// src/constants/purchaseRequestStatus.js

export const REQUEST_FILTER_ALL = "전체"
export const REQUEST_DEPARTMENT_ALL = "전체 부서"
export const REQUEST_CATEGORY_ALL = "전체 카테고리"

export const REQUEST_STATUS = {
  PENDING_APPROVAL: {
    code: "PENDING_APPROVAL",
    label: "승인 대기",
    aliases: ["DRAFT", "PENDING", "WAITING", "REQUESTED", "승인대기"],
    className: "border-amber-200 bg-amber-50 text-amber-600",
    tableClassName: "border-slate-200 bg-white text-slate-600",
  },
  APPROVED: {
    code: "APPROVED",
    label: "승인 완료",
    aliases: ["승인완료"],
    className: "border-blue-200 bg-blue-50 text-blue-600",
    tableClassName: "border-blue-200 bg-blue-50 text-blue-600",
  },
  REJECTED: {
    code: "REJECTED",
    label: "반려",
    aliases: [],
    className: "border-rose-200 bg-rose-50 text-rose-500",
    tableClassName: "border-rose-200 bg-rose-50 text-rose-500",
  },
  ORDERED: {
    code: "ORDERED",
    label: "발주 완료",
    aliases: ["발주완료"],
    className: "border-slate-200 bg-slate-100 text-slate-700",
    tableClassName: "border-slate-200 bg-slate-50 text-slate-700",
  },
  CANCELED: {
    code: "CANCELED",
    label: "요청 취소",
    aliases: ["CANCELLED", "CANCEL_REQUESTED", "요청취소"],
    className: "border-slate-200 bg-slate-100 text-slate-500",
    tableClassName: "border-slate-200 bg-slate-100 text-slate-500",
  },
}

const statusEntries = Object.values(REQUEST_STATUS)

export const REQUEST_STATUS_OPTIONS = [
  { value: REQUEST_FILTER_ALL, label: REQUEST_FILTER_ALL },
  ...statusEntries.map((status) => ({
    value: status.code,
    label: status.label,
  })),
]

export const REQUEST_STATUS_LABEL_OPTIONS = [
  REQUEST_FILTER_ALL,
  ...statusEntries.map((status) => status.label),
]

export const REQUEST_PRIORITY = {
  NORMAL: {
    code: "NORMAL",
    label: "일반",
    aliases: [],
    className: "border-slate-200 bg-slate-50 text-slate-500",
  },
  URGENT: {
    code: "URGENT",
    label: "긴급",
    aliases: [],
    className: "border-rose-200 bg-rose-50 text-rose-500",
  },
}

export const REQUEST_PRIORITY_OPTIONS = [
  REQUEST_FILTER_ALL,
  ...Object.values(REQUEST_PRIORITY).map((priority) => priority.label),
]

export const EDITABLE_REQUEST_STATUS_LABELS = new Set([
  REQUEST_STATUS.PENDING_APPROVAL.label,
])

export const FALLBACK_STATUS_CLASS_NAME =
  "border-slate-200 bg-slate-50 text-slate-500"

export function resolveRequestStatusLabel(status) {
  if (!status) return REQUEST_STATUS.PENDING_APPROVAL.label

  const normalizedStatus = String(status).trim()

  const matchedStatus = statusEntries.find(
    (entry) =>
      entry.code === normalizedStatus ||
      entry.label === normalizedStatus ||
      entry.aliases.includes(normalizedStatus),
  )

  return matchedStatus?.label ?? normalizedStatus
}

export function resolveRequestStatusCode(status) {
  if (!status || status === REQUEST_FILTER_ALL) return status

  const normalizedStatus = String(status).trim()

  const matchedStatus = statusEntries.find(
    (entry) =>
      entry.code === normalizedStatus ||
      entry.label === normalizedStatus ||
      entry.aliases.includes(normalizedStatus),
  )

  return matchedStatus?.code ?? normalizedStatus
}

export function getRequestStatusClassName(status, { table = false } = {}) {
  const normalizedStatus = resolveRequestStatusLabel(status)
  const matchedStatus = statusEntries.find(
    (entry) => entry.label === normalizedStatus,
  )

  if (!matchedStatus) return FALLBACK_STATUS_CLASS_NAME

  return table ? matchedStatus.tableClassName : matchedStatus.className
}

export function resolveRequestPriorityLabel(priority) {
  if (!priority) return REQUEST_PRIORITY.NORMAL.label

  const normalizedPriority = String(priority).trim()

  const matchedPriority = Object.values(REQUEST_PRIORITY).find(
    (entry) =>
      entry.code === normalizedPriority ||
      entry.label === normalizedPriority ||
      entry.aliases.includes(normalizedPriority),
  )

  return matchedPriority?.label ?? normalizedPriority
}

export function resolveRequestPriorityCode(priority) {
  return resolveRequestPriorityLabel(priority) === REQUEST_PRIORITY.URGENT.label
    ? REQUEST_PRIORITY.URGENT.code
    : REQUEST_PRIORITY.NORMAL.code
}

export function getRequestPriorityClassName(priority) {
  const normalizedPriority = resolveRequestPriorityLabel(priority)
  const matchedPriority = Object.values(REQUEST_PRIORITY).find(
    (entry) => entry.label === normalizedPriority,
  )

  return matchedPriority?.className ?? REQUEST_PRIORITY.NORMAL.className
}
