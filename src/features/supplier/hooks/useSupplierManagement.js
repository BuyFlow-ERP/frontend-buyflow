"use client"

import { useEffect, useState } from "react"
import {
  changeSupplierTradeStatus,
  checkSupplierBusinessNumber,
  createSupplier,
  fetchSupplierById,
  fetchSupplierFilterOptions,
  fetchSuppliers,
  updateSupplier,
} from "@/features/supplier/api/supplierApi"
import {
  createSupplierPayload,
  DEFAULT_SUPPLIER_FILTER_OPTIONS,
  DEFAULT_SUPPLIER_FILTERS,
  DEFAULT_SUPPLIER_PAGINATION,
} from "@/features/supplier/utils/supplierManagementUtils"

export default function useSupplierManagement() {
  const [draftFilters, setDraftFilters] = useState({
    ...DEFAULT_SUPPLIER_FILTERS,
  })
  const [appliedFilters, setAppliedFilters] = useState({
    ...DEFAULT_SUPPLIER_FILTERS,
  })
  const [suppliers, setSuppliers] = useState([])
  const [pagination, setPagination] = useState({
    ...DEFAULT_SUPPLIER_PAGINATION,
  })
  const [pageSize, setPageSize] = useState(15)
  const [filterOptions, setFilterOptions] = useState(
    DEFAULT_SUPPLIER_FILTER_OPTIONS,
  )
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statusChangingId, setStatusChangingId] = useState(null)
  const [error, setError] = useState("")
  const [detailSupplier, setDetailSupplier] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false

    fetchSupplierFilterOptions()
      .then((data) => {
        if (!ignore) {
          setFilterOptions(data)
        }
      })
      .catch(() => {
        if (!ignore) {
          setFilterOptions(DEFAULT_SUPPLIER_FILTER_OPTIONS)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadSuppliers() {
      setLoading(true)
      setError("")

      try {
        const data = await fetchSuppliers({
          ...appliedFilters,
          page: pagination.page,
          size: pageSize,
        })

        if (ignore) {
          return
        }

        setSuppliers(data.items)
        setPagination(data.pagination)
      } catch (requestError) {
        if (!ignore) {
          setError(
            requestError.message ||
              "공급업체 목록을 불러오지 못했습니다.",
          )
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadSuppliers()

    return () => {
      ignore = true
    }
  }, [appliedFilters, pagination.page, pageSize, reloadKey])

  function refreshSuppliers() {
    setReloadKey((currentKey) => currentKey + 1)
  }

  function updateFilter(name, value) {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  function searchSuppliers(event) {
    event?.preventDefault()

    setPagination((currentPagination) => ({
      ...currentPagination,
      page: 1,
    }))
    setAppliedFilters({ ...draftFilters })
  }

  function resetFilters() {
    setDraftFilters({ ...DEFAULT_SUPPLIER_FILTERS })
    setPagination((currentPagination) => ({
      ...currentPagination,
      page: 1,
    }))
    setAppliedFilters({ ...DEFAULT_SUPPLIER_FILTERS })
  }

  function movePage(nextPage) {
    const safeTotalPages = Math.max(pagination.totalPages, 1)
    const safePage = Math.min(Math.max(nextPage, 1), safeTotalPages)

    setPagination((currentPagination) => ({
      ...currentPagination,
      page: safePage,
    }))
  }

  function changePageSize(nextPageSize) {
    setPageSize(nextPageSize)
    setPagination((currentPagination) => ({
      ...currentPagination,
      page: 1,
    }))
  }

  async function openSupplierDetail(supplier) {
    try {
      const detail = await fetchSupplierById(supplier.id)
      setDetailSupplier(detail)
    } catch (requestError) {
      window.alert(
        requestError.message ||
          "공급업체 상세 정보를 불러오지 못했습니다.",
      )
    }
  }

  function closeSupplierDetail() {
    setDetailSupplier(null)
  }

  async function saveSupplier({ mode, supplierId, values }) {
    setSaving(true)

    try {
      const payload = createSupplierPayload(values)
      const savedSupplier =
        mode === "edit"
          ? await updateSupplier(supplierId, payload)
          : await createSupplier(payload)

      refreshSuppliers()
      setDetailSupplier(savedSupplier)

      return savedSupplier
    } finally {
      setSaving(false)
    }
  }

  async function checkBusinessNumber(businessNumber, excludeSupplierId) {
    return checkSupplierBusinessNumber(businessNumber, excludeSupplierId)
  }

  async function changeSupplierStatus(supplier, nextTradeStatus) {
    setStatusChangingId(supplier.id)

    try {
      const updatedSupplier = await changeSupplierTradeStatus(
        supplier.id,
        nextTradeStatus,
      )

      setSuppliers((currentSuppliers) =>
        currentSuppliers.map((currentSupplier) =>
          currentSupplier.id === updatedSupplier.id
            ? updatedSupplier
            : currentSupplier,
        ),
      )
      setDetailSupplier((currentDetail) =>
        currentDetail?.id === updatedSupplier.id ? updatedSupplier : currentDetail,
      )

      return updatedSupplier
    } finally {
      setStatusChangingId(null)
    }
  }

  return {
    draftFilters,
    filterOptions,
    suppliers,
    pagination,
    pageSize,
    loading,
    saving,
    statusChangingId,
    error,
    detailSupplier,
    updateFilter,
    searchSuppliers,
    resetFilters,
    movePage,
    changePageSize,
    openSupplierDetail,
    closeSupplierDetail,
    saveSupplier,
    refreshSuppliers,
    checkBusinessNumber,
    changeSupplierStatus,
  }
}
