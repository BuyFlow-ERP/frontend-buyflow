import { downloadCsvFile } from "@/lib/file/downloadFile"
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination"
import {
  REQUEST_DEPARTMENT_ALL,
  REQUEST_FILTER_ALL,
  REQUEST_PRIORITY_OPTIONS,
  REQUEST_STATUS_LABEL_OPTIONS,
} from "@/constants/purchaseRequestStatus"

export { createPageNumbers } from "@/constants/pagination"

export const DEFAULT_PURCHASE_REQUEST_FILTERS = {
  requestNumber: "",
  title: "",
  requester: "",
  department: REQUEST_DEPARTMENT_ALL,
  status: REQUEST_FILTER_ALL,
  priority: REQUEST_FILTER_ALL,
  desiredReceiptAt: "",
}

export const DEFAULT_PURCHASE_REQUEST_FILTER_OPTIONS = {
  departments: [REQUEST_DEPARTMENT_ALL],
  statuses: REQUEST_STATUS_LABEL_OPTIONS,
  priorities: REQUEST_PRIORITY_OPTIONS,
}

export const DEFAULT_PURCHASE_REQUEST_PAGINATION = {
  page: 1,
  size: DEFAULT_PAGE_SIZE,
  totalElements: 0,
  totalPages: 1,
}

export function downloadPurchaseRequestCsv(requests) {
  const headers = [
    "요청 번호",
    "요청 제목",
    "요청자",
    "요청 부서",
    "요청일",
    "수정일",
    "희망 입고일",
    "품목 수",
    "총 요청 금액",
    "우선순위",
    "상태",
    "관리",
  ]

  const rows = requests.map((request) => [
    request.requestNumber,
    request.title,
    request.requester,
    request.department,
    request.requestedAt ?? request.createdAt,
    request.updatedAt,
    request.desiredReceiptAt,
    request.itemCount,
    request.totalAmount,
    request.priority,
    request.status,
  ])

  downloadCsvFile([headers, ...rows], "구매요청목록.csv")
}

export function formatWon(value = 0) {
  return `${Number(value).toLocaleString("ko-KR")}원`
}
