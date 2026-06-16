import { apiFetch } from "@/lib/api/fetchClient"
import {
  mockSuppliers,
  supplierFilterOptions,
} from "@/features/supplier/data/mockSupplierData"

const USE_MOCK = process.env.NEXT_PUBLIC_USE_SUPPLIER_MOCK === "true"

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function includesKeyword(value, keyword) {
  return value.toLowerCase().includes(keyword.trim().toLowerCase())
}

function getMockSuppliers(params) {
  const {
    page = 1,
    size = 10,
    supplierCode = "",
    supplierName = "",
    manager = "",
    tradeStatus = "전체",
  } = params

  const filteredSuppliers = mockSuppliers.filter((supplier) => {
    const matchesSupplierCode =
      !supplierCode || includesKeyword(supplier.code, supplierCode)

    const matchesSupplierName =
      !supplierName || includesKeyword(supplier.name, supplierName)

    const matchesManager =
      !manager || includesKeyword(supplier.manager, manager)

    const matchesTradeStatus =
      tradeStatus === "전체" || supplier.tradeStatus === tradeStatus

    return (
      matchesSupplierCode &&
      matchesSupplierName &&
      matchesManager &&
      matchesTradeStatus
    )
  })

  const totalElements = filteredSuppliers.length
  const totalPages = Math.max(1, Math.ceil(totalElements / size))

  const safePage = Math.min(Math.max(page, 1), totalPages)

  const offset = (safePage - 1) * size

  return {
    items: filteredSuppliers.slice(offset, offset + size),
    pagination: {
      page: safePage,
      size,
      totalElements,
      totalPages,
    },
  }
}

function normalizeSupplierResponse(data) {
  if (Array.isArray(data.items) && data.pagination) {
    return data
  }

  return {
    items: data.content ?? [],
    pagination: {
      page: (data.number ?? 0) + 1,
      size: data.size ?? 10,
      totalElements: data.totalElements ?? 0,
      totalPages: Math.max(data.totalPages ?? 1, 1),
    },
  }
}

function appendSupplierQuery(query, key, value) {
  if (value === undefined || value === null || value === "" || value === "전체") {
    return
  }

  query.set(key, key === "page" ? String(Number(value) - 1) : String(value))
}

export async function fetchSuppliers(params = {}) {
  if (USE_MOCK) {
    await wait(150)
    return getMockSuppliers(params)
  }

  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    appendSupplierQuery(query, key, value)
  })

  const queryString = query.toString()
  const data = await apiFetch(
    `/api/suppliers${queryString ? `?${queryString}` : ""}`,
    { cache: "no-store" },
  )

  return normalizeSupplierResponse(data)
}

export async function fetchSupplierFilterOptions() {
  if (USE_MOCK) {
    return supplierFilterOptions
  }

  return apiFetch(
    "/api/suppliers/filter-options",
    { cache: "no-store" },
  )
}

const SUPPLIER_TRADE_STATUS_LABELS = {
  ACTIVE: "거래중",
  STOPPED: "거래중지",
  INACTIVE: "거래중지",
}

function normalizeSupplierDetailResponse(data) {
  return {
    id: data.id ?? data.supplierId,
    code: data.code ?? data.supplierCode ?? "",
    name: data.name ?? data.supplierName ?? "",
    businessNumber:
      data.businessNumber ?? data.businessRegistrationNumber ?? "",
    manager: data.manager ?? data.managerName ?? "",
    phone: data.phone ?? data.contactNumber ?? "",
    email: data.email ?? "",
    address: data.address ?? "",
    tradeStatus:
      SUPPLIER_TRADE_STATUS_LABELS[data.tradeStatus] ?? data.tradeStatus ?? "",
    registeredAt:
      data.registeredAt ??
      data.createdAt?.slice?.(0, 10) ??
      data.createdAt ??
      "",
  }
}

export async function fetchSupplierById(supplierId) {
  if (!supplierId) {
    throw new Error("공급업체 ID가 없습니다.")
  }

  if (USE_MOCK) {
    await wait(100)

    const supplier = mockSuppliers.find(
      (item) => item.id === Number(supplierId),
    )

    if (!supplier) {
      throw new Error("공급업체 정보를 찾을 수 없습니다.")
    }

    return normalizeSupplierDetailResponse(supplier)
  }

  const data = await apiFetch(
    `/api/suppliers/${encodeURIComponent(supplierId)}`,
    { cache: "no-store" },
  )

  return normalizeSupplierDetailResponse(data)
}
