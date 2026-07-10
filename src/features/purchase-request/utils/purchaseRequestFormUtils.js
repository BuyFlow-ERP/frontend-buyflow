import {
  MAX_ATTACHMENT_SIZE,
  MAX_ATTACHMENT_SIZE_MB,
  PURCHASE_REQUEST_CATEGORY_ALL,
} from "@/features/purchase-request/config/purchaseRequestFormConfig"

export function filterSelectableProducts(products, keyword, category) {
  const normalizedKeyword = keyword.trim().toLowerCase()

  return products.filter((product) => {
    const matchesKeyword =
      !normalizedKeyword ||
      String(product.code ?? "")
        .toLowerCase()
        .includes(normalizedKeyword) ||
      String(product.name ?? "")
        .toLowerCase()
        .includes(normalizedKeyword)

    const matchesCategory =
      category === PURCHASE_REQUEST_CATEGORY_ALL ||
      product.category === category

    return matchesKeyword && matchesCategory
  })
}

export function createCategoryOptions(products) {
  const categories = products.map((product) => product.category).filter(Boolean)

  return [PURCHASE_REQUEST_CATEGORY_ALL, ...Array.from(new Set(categories))]
}

export function getValidatedAttachment(event) {
  const file = event.target.files?.[0] ?? null

  if (!file) {
    return null
  }

  if (file.size > MAX_ATTACHMENT_SIZE) {
    window.alert(
      `첨부파일은 최대 ${MAX_ATTACHMENT_SIZE_MB}MB까지 업로드할 수 있습니다.`,
    )
    event.target.value = ""
    return null
  }

  return file
}

export function toPurchaseRequestItemPayload(item) {
  return {
    productId: Number(item.productId ?? item.id),
    requestQuantity: Number(item.quantity ?? item.requestQuantity ?? 1),
    estimatedUnitPrice: Number(item.unitPrice ?? item.estimatedUnitPrice ?? 0),
    remark: item.remark ?? "",
  }
}
