export const SUPPLIER_TRADE_STATUS = {
  ALL: "전체",
  ACTIVE: "거래중",
  STOPPED: "거래중지",
}

export const DEFAULT_SUPPLIER_FILTERS = {
  supplierCode: "",
  supplierName: "",
  manager: "",
  tradeStatus: SUPPLIER_TRADE_STATUS.ALL,
}

export const DEFAULT_SUPPLIER_PAGINATION = {
  page: 1,
  size: 15,
  totalElements: 0,
  totalPages: 1,
}

export const DEFAULT_SUPPLIER_FILTER_OPTIONS = {
  tradeStatuses: [
    SUPPLIER_TRADE_STATUS.ALL,
    SUPPLIER_TRADE_STATUS.ACTIVE,
    SUPPLIER_TRADE_STATUS.STOPPED,
  ],
}

export const SUPPLIER_TABLE_HEADERS = [
  "공급업체 코드",
  "공급업체명",
  "사업자등록번호",
  "담당자",
  "연락처",
  "이메일",
  "주소",
  "상태",
  "등록일",
  "관리",
]

export function createPageNumbers(currentPage, totalPages) {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, "ellipsis-right", totalPages]
  }

  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis-left", totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, "ellipsis-left", currentPage, "ellipsis-right", totalPages]
}

export function normalizeBusinessNumber(value = "") {
  return String(value).replace(/\D/g, "")
}

export function formatBusinessNumber(value = "") {
  const digits = normalizeBusinessNumber(value)

  if (!digits) {
    return "-"
  }

  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
  }

  return value
}

export function toTradeStatusCode(value) {
  if (value === "ACTIVE" || value === SUPPLIER_TRADE_STATUS.ACTIVE) {
    return "ACTIVE"
  }

  if (
    value === "STOPPED" ||
    value === "INACTIVE" ||
    value === SUPPLIER_TRADE_STATUS.STOPPED
  ) {
    return "STOPPED"
  }

  return ""
}

export function toTradeStatusLabel(value) {
  if (value === "ACTIVE" || value === SUPPLIER_TRADE_STATUS.ACTIVE) {
    return SUPPLIER_TRADE_STATUS.ACTIVE
  }

  if (
    value === "STOPPED" ||
    value === "INACTIVE" ||
    value === SUPPLIER_TRADE_STATUS.STOPPED
  ) {
    return SUPPLIER_TRADE_STATUS.STOPPED
  }

  return value || "-"
}

export function getNextSupplierTradeStatus(status) {
  return toTradeStatusCode(status) === "ACTIVE" ? "STOPPED" : "ACTIVE"
}

export function createEmptySupplierForm() {
  return {
    id: null,
    supplierId: null,
    supplierCode: "",
    supplierName: "",
    businessNumber: "",
    manager: "",
    phone: "",
    email: "",
    address: "",
    tradeStatus: SUPPLIER_TRADE_STATUS.ACTIVE,
  }
}

export function createSupplierFormFromDetail(supplier) {
  return {
    id: supplier?.id ?? supplier?.supplierId ?? null,
    supplierId: supplier?.supplierId ?? supplier?.id ?? null,
    supplierCode: supplier?.code ?? supplier?.supplierCode ?? "",
    supplierName: supplier?.name ?? supplier?.supplierName ?? "",
    businessNumber: formatBusinessNumber(supplier?.businessNumber ?? ""),
    manager: supplier?.manager ?? "",
    phone: supplier?.phone ?? "",
    email: supplier?.email ?? "",
    address: supplier?.address ?? "",
    tradeStatus: toTradeStatusLabel(
      supplier?.tradeStatusCode ?? supplier?.tradeStatus,
    ),
  }
}

export function createSupplierPayload(values) {
  const businessNumber = normalizeBusinessNumber(values.businessNumber)

  return {
    supplierCode: values.supplierCode?.trim() || null,
    supplierName: values.supplierName?.trim() || "",
    businessNumber: businessNumber || null,
    manager: values.manager?.trim() || null,
    phone: values.phone?.trim() || null,
    email: values.email?.trim() || null,
    address: values.address?.trim() || null,
    tradeStatus: toTradeStatusCode(values.tradeStatus) || "ACTIVE",
  }
}

export function hasSupplierManageAuthority(sessionOrUser) {
  const user = sessionOrUser?.user ?? sessionOrUser ?? {}
  const roles = sessionOrUser?.roles ?? user.roles ?? []
  const permissions = sessionOrUser?.permissions ?? user.permissions ?? []
  const authorities = sessionOrUser?.authorities ?? user.authorities ?? []
  const mergedAuthorities = [...roles, ...permissions, ...authorities].map(String)

  return (
    user.accountType === "ADMIN" ||
    user.jobRank === "ADMIN" ||
    user.jobRankCode === "ADMIN" ||
    user.position === "관리자" ||
    user.role === "ADMIN" ||
    user.roleCode === "ADMIN" ||
    user.roleName === "관리자" ||
    mergedAuthorities.includes("ADMIN") ||
    mergedAuthorities.includes("ROLE_ADMIN") ||
    mergedAuthorities.includes("SUPPLIER_MANAGE")
  )
}
