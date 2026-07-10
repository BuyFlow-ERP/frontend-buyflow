// src/constants/productStatus.js

export const FILTER_ALL = "전체"

export const PRODUCT_ACTIVE_STATUS = {
  ACTIVE: "사용",
  INACTIVE: "미사용",
}

export const PRODUCT_ACTIVE_STATUS_OPTIONS = [
  FILTER_ALL,
  PRODUCT_ACTIVE_STATUS.ACTIVE,
  PRODUCT_ACTIVE_STATUS.INACTIVE,
]

export function resolveProductActiveStatus(value) {
  if (
    value === true ||
    value === "Y" ||
    value === PRODUCT_ACTIVE_STATUS.ACTIVE
  ) {
    return PRODUCT_ACTIVE_STATUS.ACTIVE
  }

  if (
    value === false ||
    value === "N" ||
    value === PRODUCT_ACTIVE_STATUS.INACTIVE
  ) {
    return PRODUCT_ACTIVE_STATUS.INACTIVE
  }

  return PRODUCT_ACTIVE_STATUS.ACTIVE
}

export function toProductUseYn(value) {
  return value === PRODUCT_ACTIVE_STATUS.INACTIVE ? "N" : "Y"
}
