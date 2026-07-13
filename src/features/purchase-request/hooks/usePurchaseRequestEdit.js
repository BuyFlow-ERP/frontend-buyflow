"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  fetchPurchaseRequestDetail,
  fetchPurchaseRequestProducts,
  updatePurchaseRequest,
} from "@/features/purchase-request/api/purchaseRequestApi"
import { calculateRequestTotal } from "@/features/purchase-request/utils/purchaseRequestUtils"
import {
  DEFAULT_ITEM_REMARK,
  LOCKED_PURCHASE_REQUEST_FORM_FIELDS,
  PURCHASE_REQUEST_CATEGORY_ALL,
} from "@/features/purchase-request/config/purchaseRequestFormConfig"
import {
  createCategoryOptions,
  filterSelectableProducts,
  getValidatedAttachment,
  toPurchaseRequestItemPayload,
} from "@/features/purchase-request/utils/purchaseRequestFormUtils"
import {
  EDITABLE_REQUEST_STATUS_LABELS,
  resolveRequestPriorityCode,
} from "@/constants/purchaseRequestStatus"

const INITIAL_FORM = {
  requestNumber: "",
  requester: "",
  department: "",
  requestDate: "",
  expectedDate: "",
  title: "",
  urgency: "일반",
  reason: "",
}

function normalizeEditItem(item, productMap = new Map()) {
  const productId = Number(item.productId ?? item.id)
  const product = productMap.get(productId)

  return {
    id: productId,
    productId,
    code: item.itemCode || product?.code || "",
    name: item.itemName || product?.name || "",
    category: item.category || product?.category || "",
    spec: item.specification || product?.spec || "",
    unit: item.unit || product?.unit || "",
    currentStock: product?.currentStock ?? 0,
    unitPrice: Number(item.estimatedUnitPrice ?? product?.unitPrice ?? 0),
    quantity: Number(item.requestQuantity ?? item.quantity ?? 1),
    remark: item.remark ?? DEFAULT_ITEM_REMARK,
  }
}

export default function usePurchaseRequestEdit(requestId) {
  const router = useRouter()

  const [originalRequest, setOriginalRequest] = useState(null)
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(INITIAL_FORM)
  const [requestItems, setRequestItems] = useState([])
  const [attachment, setAttachment] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProductLoading, setIsProductLoading] = useState(false)
  const submittingRef = useRef(false)

  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [draftSelectedIds, setDraftSelectedIds] = useState(new Set())

  const [keyword, setKeyword] = useState("")
  const [category, setCategory] = useState(PURCHASE_REQUEST_CATEGORY_ALL)
  const [appliedKeyword, setAppliedKeyword] = useState("")
  const [appliedCategory, setAppliedCategory] = useState(
    PURCHASE_REQUEST_CATEGORY_ALL,
  )

  useEffect(() => {
    let ignore = false

    async function loadEditData() {
      setLoading(true)
      setError("")

      try {
        const requestDetail = await fetchPurchaseRequestDetail(requestId)

        if (ignore) {
          return
        }

        if (!EDITABLE_REQUEST_STATUS_LABELS.has(requestDetail.status)) {
          setError(
            `${requestDetail.status} 상태의 구매 요청은 수정할 수 없습니다.`,
          )
          setOriginalRequest(requestDetail)
          return
        }

        setOriginalRequest(requestDetail)

        setForm({
          requestNumber: requestDetail.requestNumber ?? "",
          requester: requestDetail.requester ?? "",
          department: requestDetail.department ?? "",
          requestDate: requestDetail.requestedAt ?? "",
          expectedDate: requestDetail.desiredReceiptAt ?? "",
          title: requestDetail.title ?? "",
          urgency: requestDetail.priority === "긴급" ? "긴급" : "일반",
          reason: requestDetail.reason ?? "",
        })

        setRequestItems(
          (requestDetail.items ?? []).map((item) => normalizeEditItem(item)),
        )
      } catch (loadError) {
        if (!ignore) {
          console.error("구매 요청 수정 정보 조회 실패:", loadError)

          setError(
            loadError.message || "구매 요청 수정 정보를 불러오지 못했습니다.",
          )
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadEditData()

    return () => {
      ignore = true
    }
  }, [requestId])

  const totalAmount = useMemo(
    () => calculateRequestTotal(requestItems),
    [requestItems],
  )

  const filteredProducts = useMemo(
    () => filterSelectableProducts(products, appliedKeyword, appliedCategory),
    [products, appliedCategory, appliedKeyword],
  )

  const categoryOptions = useMemo(
    () => createCategoryOptions(products),
    [products],
  )

  function updateForm(name, value) {
    if (LOCKED_PURCHASE_REQUEST_FORM_FIELDS.has(name)) {
      return
    }

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function changeAttachment(event) {
    setAttachment(getValidatedAttachment(event))
  }

  async function openItemModal() {
    setDraftSelectedIds(new Set(requestItems.map((item) => item.id)))

    if (products.length > 0) {
      setIsItemModalOpen(true)
      return
    }

    setIsProductLoading(true)

    try {
      const productList = await fetchPurchaseRequestProducts()

      const normalizedProducts = Array.isArray(productList)
        ? productList
        : (productList.items ?? [])

      setProducts(normalizedProducts)
      setIsItemModalOpen(true)
    } catch (productError) {
      console.error("품목 목록 조회 실패:", productError)

      window.alert(productError.message || "품목 목록을 불러오지 못했습니다.")
    } finally {
      setIsProductLoading(false)
    }
  }

  function closeItemModal() {
    setIsItemModalOpen(false)
  }

  function searchProducts(event) {
    event.preventDefault()
    setAppliedKeyword(keyword)
    setAppliedCategory(category)
  }

  function toggleDraftProduct(productId) {
    setDraftSelectedIds((currentIds) => {
      const nextIds = new Set(currentIds)

      if (nextIds.has(productId)) {
        nextIds.delete(productId)
      } else {
        nextIds.add(productId)
      }

      return nextIds
    })
  }

  function toggleAllFilteredProducts() {
    const allFilteredSelected = filteredProducts.every((product) =>
      draftSelectedIds.has(product.id),
    )

    setDraftSelectedIds((currentIds) => {
      const nextIds = new Set(currentIds)

      filteredProducts.forEach((product) => {
        if (allFilteredSelected) {
          nextIds.delete(product.id)
        } else {
          nextIds.add(product.id)
        }
      })

      return nextIds
    })
  }

  function confirmSelectedProducts() {
    const currentItemMap = new Map(requestItems.map((item) => [item.id, item]))

    const nextItems = products
      .filter((product) => draftSelectedIds.has(product.id))
      .map((product) => {
        const currentItem = currentItemMap.get(product.id)

        return {
          ...product,
          productId: product.id,
          quantity: currentItem?.quantity ?? 1,
          remark: currentItem?.remark ?? DEFAULT_ITEM_REMARK,
        }
      })

    setRequestItems(nextItems)
    setIsItemModalOpen(false)
  }

  function changeQuantity(productId, quantity) {
    const safeQuantity = Math.max(1, Number(quantity) || 1)

    setRequestItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: safeQuantity } : item,
      ),
    )
  }

  function changeRemark(productId, remark) {
    setRequestItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, remark } : item,
      ),
    )
  }

  function removeItem(productId) {
    setRequestItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    )
  }

  async function submitUpdate() {
    if (submittingRef.current) {
      return
    }

    const requiredFields = [
      { label: "희망 입고일", value: form.expectedDate },
      { label: "요청 제목", value: form.title },
      { label: "요청 사유", value: form.reason },
    ]

    const emptyField = requiredFields.find(
      ({ value }) => !String(value ?? "").trim(),
    )

    if (emptyField) {
      window.alert(`${emptyField.label} 항목을 입력해 주세요.`)
      return
    }

    if (form.expectedDate < form.requestDate) {
      window.alert("희망 입고일은 요청일보다 이전일 수 없습니다.")
      return
    }

    if (requestItems.length === 0) {
      window.alert("구매 요청 품목을 1개 이상 추가해 주세요.")
      return
    }

    submittingRef.current = true
    setIsSubmitting(true)

    const fixedRequestDate = originalRequest?.requestedAt ?? form.requestDate

    try {
      const payload = {
        requestNumber: form.requestNumber,
        requestDate: fixedRequestDate,
        expectedDate: form.expectedDate,
        title: form.title,
        urgency: form.urgency,
        priority: resolveRequestPriorityCode(form.urgency),
        reason: form.reason,
        items: requestItems.map(toPurchaseRequestItemPayload),
      }

      await updatePurchaseRequest(requestId, payload, attachment)

      window.alert("구매 요청을 수정했습니다.")
      router.replace("/purchase-requests")
    } catch (submitError) {
      console.error("구매 요청 수정 실패:", submitError)
      window.alert(
        submitError.message ||
          "구매 요청 수정에 실패했습니다. 다시 시도해 주세요.",
      )
    } finally {
      submittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return {
    originalRequest,
    form,
    attachment,
    requestItems,
    totalAmount,
    loading,
    error,
    isSubmitting,
    isItemModalOpen,
    draftSelectedIds,
    keyword,
    category,
    categoryOptions,
    filteredProducts,
    isProductLoading,
    openItemModal,
    updateForm,
    changeAttachment,
    openItemModal,
    closeItemModal,
    setKeyword,
    setCategory,
    searchProducts,
    toggleDraftProduct,
    toggleAllFilteredProducts,
    confirmSelectedProducts,
    changeQuantity,
    changeRemark,
    removeItem,
    submitUpdate,
  }
}
