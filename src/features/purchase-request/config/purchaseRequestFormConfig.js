import { REQUEST_CATEGORY_ALL } from "@/constants/purchaseRequestStatus"

export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024
export const MAX_ATTACHMENT_SIZE_MB = 10
export const DEFAULT_ITEM_REMARK = ""
export const PURCHASE_REQUEST_CATEGORY_ALL = REQUEST_CATEGORY_ALL

export const LOCKED_PURCHASE_REQUEST_FORM_FIELDS = new Set([
  "requestNumber",
  "requester",
  "department",
  "requestDate",
])
