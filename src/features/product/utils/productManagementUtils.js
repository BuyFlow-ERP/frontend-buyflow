import { downloadCsvFile } from "@/lib/file/downloadFile"
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination"
import {
  FILTER_ALL,
  PRODUCT_ACTIVE_STATUS,
  PRODUCT_ACTIVE_STATUS_OPTIONS,
} from "@/constants/productStatus"

export { createPageNumbers } from "@/constants/pagination"

export const DEFAULT_FILTERS = {
  itemCode: "",
  itemName: "",
  category: FILTER_ALL,
  unit: FILTER_ALL,
  activeStatus: PRODUCT_ACTIVE_STATUS.ACTIVE,
}

export const DEFAULT_PAGINATION = {
  page: 1,
  size: DEFAULT_PAGE_SIZE,
  totalElements: 0,
  totalPages: 1,
}

export const DEFAULT_FILTER_OPTIONS = {
  categories: [FILTER_ALL],
  units: [FILTER_ALL],
  activeStatuses: PRODUCT_ACTIVE_STATUS_OPTIONS,
}

export const PRODUCT_TABLE_HEADERS = [
  "품목 코드",
  "품목명",
  "카테고리",
  "규격",
  "단위",
  "기준 단가",
  "사용 여부",
  "등록일",
  "수정일",
  "관리",
]

export function formatWon(value = 0) {
  return `₩${Number(value).toLocaleString("ko-KR")}`
}

export function downloadProductCsv(products) {
  const headers = [
    "품목 코드",
    "품목명",
    "카테고리",
    "규격",
    "단위",
    "기준 단가",
    "사용 여부",
    "등록일",
    "수정일",
  ]

  const rows = products.map((product) => [
    product.code,
    product.name,
    product.category,
    product.spec,
    product.unit,
    product.unitPrice,
    product.isActive
      ? PRODUCT_ACTIVE_STATUS.ACTIVE
      : PRODUCT_ACTIVE_STATUS.INACTIVE,
    product.registeredAt,
    product.updatedAt,
  ])

  downloadCsvFile([headers, ...rows], "품목관리.csv")
}
