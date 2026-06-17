"use client"

import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import SupplierDetailModal from "@/features/supplier/components/SupplierDetailModal"
import SupplierFormModal from "@/features/supplier/components/SupplierFormModal"
import SupplierPagination from "@/features/supplier/components/SupplierPagination"
import SupplierSearchForm from "@/features/supplier/components/SupplierSearchForm"
import SupplierTable from "@/features/supplier/components/SupplierTable"
import { useAuth } from "@/features/auth/context/AuthContext"
import { getAuthSession } from "@/features/auth/utils/authStorage"
import useSupplierManagement from "@/features/supplier/hooks/useSupplierManagement"
import {
  createEmptySupplierForm,
  createSupplierFormFromDetail,
  getNextSupplierTradeStatus,
  hasSupplierManageAuthority,
  toTradeStatusLabel,
} from "@/features/supplier/utils/supplierManagementUtils"

export default function SupplierManagement() {
  const auth = useAuth()
  const {
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
    checkBusinessNumber,
    changeSupplierStatus,
  } = useSupplierManagement()

  const [formMode, setFormMode] = useState("create")
  const [formValues, setFormValues] = useState(createEmptySupplierForm)
  const [formError, setFormError] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)

  const canManageSuppliers = useMemo(
    () =>
      hasSupplierManageAuthority(getAuthSession()) ||
      hasSupplierManageAuthority(auth.user),
    [auth.user],
  )

  function openSupplierCreate() {
    setFormMode("create")
    setFormValues(createEmptySupplierForm())
    setFormError("")
    setIsFormOpen(true)
  }

  function openSupplierEdit(supplier) {
    setFormMode("edit")
    setFormValues(createSupplierFormFromDetail(supplier))
    setFormError("")
    setIsFormOpen(true)
  }

  function closeSupplierForm() {
    if (saving) {
      return
    }

    setIsFormOpen(false)
    setFormError("")
  }

  async function handleSubmitSupplier(values) {
    setFormError("")

    try {
      await saveSupplier({
        mode: formMode,
        supplierId:
          values.supplierId ?? values.id ?? detailSupplier?.supplierId ?? detailSupplier?.id,
        values,
      })

      setIsFormOpen(false)
    } catch (requestError) {
      setFormError(
        requestError.message || "공급업체 정보를 저장하지 못했습니다.",
      )
    }
  }

  async function handleChangeTradeStatus(supplier) {
    const nextStatus = getNextSupplierTradeStatus(
      supplier.tradeStatusCode ?? supplier.tradeStatus,
    )
    const nextStatusLabel = toTradeStatusLabel(nextStatus)

    if (
      !window.confirm(
        `${supplier.name || supplier.supplierName || "선택한 공급업체"}의 상태를 ${nextStatusLabel}(으)로 변경할까요?`,
      )
    ) {
      return
    }

    try {
      await changeSupplierStatus(supplier, nextStatus)
    } catch (requestError) {
      window.alert(
        requestError.message || "공급업체 거래 상태를 변경하지 못했습니다.",
      )
    }
  }

  return (
    <div className="w-full">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
            공급업체 관리
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            구매와 입고에 사용하는 공급업체 정보를 등록하고 관리합니다.
          </p>
        </div>

        {canManageSuppliers && (
          <button
            type="button"
            onClick={openSupplierCreate}
            className="inline-flex h-10 items-center gap-1.5 rounded-md bg-blue-600 px-4 text-[13px] font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={16} />
            공급업체 등록
          </button>
        )}
      </header>

      <SupplierSearchForm
        filters={draftFilters}
        filterOptions={filterOptions}
        onChange={updateFilter}
        onSearch={searchSuppliers}
        onReset={resetFilters}
      />

      <section className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <h2 className="text-[15px] font-bold text-slate-800">
            공급업체 목록
          </h2>

          <span className="text-[13px] text-slate-500">
            총 {pagination.totalElements}건
          </span>
        </div>

        <SupplierTable
          suppliers={suppliers}
          loading={loading}
          error={error}
          canManage={canManageSuppliers}
          statusChangingId={statusChangingId}
          onDetail={openSupplierDetail}
          onChangeStatus={handleChangeTradeStatus}
        />

        <SupplierPagination
          pagination={pagination}
          pageSize={pageSize}
          onChangePageSize={changePageSize}
          onMovePage={movePage}
        />
      </section>

      <SupplierDetailModal
        open={Boolean(detailSupplier)}
        supplier={detailSupplier}
        canEdit={canManageSuppliers}
        statusChanging={statusChangingId === detailSupplier?.id}
        onClose={closeSupplierDetail}
        onEdit={openSupplierEdit}
        onChangeStatus={handleChangeTradeStatus}
      />

      <SupplierFormModal
        key={`${formMode}-${formValues.supplierCode || "new"}-${
          formValues.supplierName || "empty"
        }`}
        open={isFormOpen}
        mode={formMode}
        initialValues={formValues}
        submitting={saving}
        error={formError}
        onClose={closeSupplierForm}
        onSubmit={handleSubmitSupplier}
        onCheckBusinessNumber={checkBusinessNumber}
      />
    </div>
  )
}
