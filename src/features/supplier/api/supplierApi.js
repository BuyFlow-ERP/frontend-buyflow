import { apiFetch } from "@/lib/api/fetchClient"
import {
  mockSuppliers,
  supplierFilterOptions,
} from "@/features/supplier/data/mockSupplierData"
import {
  SUPPLIER_TRADE_STATUS,
  formatBusinessNumber,
  normalizeBusinessNumber,
  toTradeStatusCode,
  toTradeStatusLabel,
} from "@/features/supplier/utils/supplierManagementUtils"

const USE_MOCK = process.env.NEXT_PUBLIC_USE_SUPPLIER_MOCK === "true"

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function includesKeyword(value = "", keyword = "") {
  return String(value).toLowerCase().includes(keyword.trim().toLowerCase())
}

function findMockSupplierIndex(supplierId) {
  return mockSuppliers.findIndex((item) => item.id === Number(supplierId))
}

function getMockSuppliers(params) {
  const {
    page = 1,
    size = 15,
    supplierCode = "",
    supplierName = "",
    manager = "",
    tradeStatus = SUPPLIER_TRADE_STATUS.ALL,
  } = params

  const filteredSuppliers = mockSuppliers.filter((supplier) => {
    const statusLabel = toTradeStatusLabel(
      supplier.tradeStatusCode ?? supplier.tradeStatus,
    )
    const matchesSupplierCode =
      !supplierCode || includesKeyword(supplier.code, supplierCode)
    const matchesSupplierName =
      !supplierName || includesKeyword(supplier.name, supplierName)
    const matchesManager = !manager || includesKeyword(supplier.manager, manager)
    const matchesTradeStatus =
      tradeStatus === SUPPLIER_TRADE_STATUS.ALL || statusLabel === tradeStatus

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

function appendSupplierQuery(query, key, value) {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === SUPPLIER_TRADE_STATUS.ALL
  ) {
    return
  }

  if (key === "page") {
    query.set(key, String(Math.max(Number(value) - 1, 0)))
    return
  }

  if (key === "tradeStatus") {
    query.set(key, toTradeStatusCode(value) || value)
    return
  }

  query.set(key, String(value))
}

function normalizeSupplierDetailResponse(data = {}) {
  const tradeStatusCode =
    data.tradeStatusCode ?? toTradeStatusCode(data.tradeStatus) ?? ""
  const createdAt = data.createdAt ?? ""
  const updatedAt = data.updatedAt ?? ""

  return {
    id: data.id ?? data.supplierId,
    supplierId: data.supplierId ?? data.id,
    code: data.code ?? data.supplierCode ?? "",
    supplierCode: data.supplierCode ?? data.code ?? "",
    name: data.name ?? data.supplierName ?? "",
    supplierName: data.supplierName ?? data.name ?? "",
    businessNumber: normalizeBusinessNumber(
      data.businessNumber ?? data.businessRegistrationNumber ?? "",
    ),
    businessNumberText: formatBusinessNumber(
      data.businessNumber ?? data.businessRegistrationNumber ?? "",
    ),
    manager: data.manager ?? data.managerName ?? "",
    phone: data.phone ?? data.contactNumber ?? "",
    email: data.email ?? "",
    address: data.address ?? "",
    tradeStatus: toTradeStatusLabel(tradeStatusCode || data.tradeStatus),
    tradeStatusCode: tradeStatusCode || toTradeStatusCode(data.tradeStatus),
    useYn: data.useYn ?? "Y",
    registeredAt:
      data.registeredAt ??
      createdAt?.slice?.(0, 10) ??
      updatedAt?.slice?.(0, 10) ??
      "",
    createdAt,
    updatedAt,
  }
}

function normalizeSupplierPageResponse(data = {}) {
  if (Array.isArray(data.items) && data.pagination) {
    return {
      items: data.items.map(normalizeSupplierDetailResponse),
      pagination: data.pagination,
    }
  }

  const content = data.content ?? []

  return {
    items: content.map(normalizeSupplierDetailResponse),
    pagination: {
      page: (data.number ?? 0) + 1,
      size: data.size ?? 15,
      totalElements: data.totalElements ?? content.length,
      totalPages: Math.max(data.totalPages ?? 1, 1),
    },
  }
}

function normalizeFilterOptions(data = {}) {
  const tradeStatuses = data.tradeStatuses?.length
    ? data.tradeStatuses.map(toTradeStatusLabel)
    : supplierFilterOptions.tradeStatuses

  return {
    ...data,
    tradeStatuses: [
      SUPPLIER_TRADE_STATUS.ALL,
      ...tradeStatuses.filter((status) => status !== SUPPLIER_TRADE_STATUS.ALL),
    ],
  }
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

  return normalizeSupplierPageResponse(data)
}

export async function fetchSupplierFilterOptions() {
  if (USE_MOCK) {
    return supplierFilterOptions
  }

  const data = await apiFetch("/api/suppliers/filter-options", {
    cache: "no-store",
  })

  return normalizeFilterOptions(data)
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

export async function checkSupplierBusinessNumber(
  businessNumber,
  excludeSupplierId,
) {
  const normalizedBusinessNumber = normalizeBusinessNumber(businessNumber)

  if (!normalizedBusinessNumber) {
    return false
  }

  if (USE_MOCK) {
    await wait(80)

    return mockSuppliers.some(
      (supplier) =>
        normalizeBusinessNumber(supplier.businessNumber) ===
          normalizedBusinessNumber &&
        String(supplier.id) !== String(excludeSupplierId ?? ""),
    )
  }

  const query = new URLSearchParams({
    businessNumber: normalizedBusinessNumber,
  })

  if (excludeSupplierId) {
    query.set("excludeSupplierId", String(excludeSupplierId))
  }

  const data = await apiFetch(
    `/api/suppliers/business-number/exists?${query.toString()}`,
    { cache: "no-store" },
  )

  return Boolean(data)
}

export async function createSupplier(payload) {
  if (USE_MOCK) {
    await wait(120)

    const nextId = Math.max(...mockSuppliers.map((supplier) => supplier.id)) + 1
    const nextSupplier = normalizeSupplierDetailResponse({
      id: nextId,
      supplierId: nextId,
      code: payload.supplierCode || `SUP-MOCK-${nextId}`,
      supplierCode: payload.supplierCode || `SUP-MOCK-${nextId}`,
      name: payload.supplierName,
      supplierName: payload.supplierName,
      ...payload,
      tradeStatusCode: toTradeStatusCode(payload.tradeStatus) || "ACTIVE",
      registeredAt: new Date().toISOString().slice(0, 10),
    })

    mockSuppliers.unshift(nextSupplier)

    return nextSupplier
  }

  const data = await apiFetch("/api/suppliers", {
    method: "POST",
    body: JSON.stringify(payload),
  })

  return normalizeSupplierDetailResponse(data)
}

export async function updateSupplier(supplierId, payload) {
  if (!supplierId) {
    throw new Error("수정할 공급업체 ID가 없습니다.")
  }

  if (USE_MOCK) {
    await wait(120)

    const supplierIndex = findMockSupplierIndex(supplierId)

    if (supplierIndex < 0) {
      throw new Error("공급업체 정보를 찾을 수 없습니다.")
    }

    const updatedSupplier = normalizeSupplierDetailResponse({
      ...mockSuppliers[supplierIndex],
      code: payload.supplierCode,
      supplierCode: payload.supplierCode,
      name: payload.supplierName,
      supplierName: payload.supplierName,
      ...payload,
      tradeStatusCode: toTradeStatusCode(payload.tradeStatus) || "ACTIVE",
    })

    mockSuppliers[supplierIndex] = updatedSupplier

    return updatedSupplier
  }

  const data = await apiFetch(
    `/api/suppliers/${encodeURIComponent(supplierId)}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  )

  return normalizeSupplierDetailResponse(data)
}

export async function changeSupplierTradeStatus(supplierId, tradeStatus) {
  if (!supplierId) {
    throw new Error("상태를 변경할 공급업체 ID가 없습니다.")
  }

  const tradeStatusCode = toTradeStatusCode(tradeStatus)

  if (!tradeStatusCode) {
    throw new Error("지원하지 않는 거래 상태입니다.")
  }

  if (USE_MOCK) {
    await wait(120)

    const supplierIndex = findMockSupplierIndex(supplierId)

    if (supplierIndex < 0) {
      throw new Error("공급업체 정보를 찾을 수 없습니다.")
    }

    const updatedSupplier = normalizeSupplierDetailResponse({
      ...mockSuppliers[supplierIndex],
      tradeStatusCode,
      tradeStatus: toTradeStatusLabel(tradeStatusCode),
      updatedAt: new Date().toISOString(),
    })

    mockSuppliers[supplierIndex] = updatedSupplier

    return updatedSupplier
  }

  const data = await apiFetch(
    `/api/suppliers/${encodeURIComponent(supplierId)}/trade-status`,
    {
      method: "PATCH",
      body: JSON.stringify({ tradeStatus: tradeStatusCode }),
    },
  )

  return normalizeSupplierDetailResponse(data)
}

export async function deleteSupplier(supplierId) {
  if (!supplierId) {
    throw new Error("삭제할 공급업체 ID가 없습니다.")
  }

  if (USE_MOCK) {
    await wait(120)
    return
  }

  await apiFetch(`/api/suppliers/${encodeURIComponent(supplierId)}`, {
    method: "DELETE",
  })
}
