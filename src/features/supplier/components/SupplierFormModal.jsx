"use client"

import { useEffect, useMemo, useState } from "react"
import { Building2, CheckCircle2, Loader2, Save, X } from "lucide-react"
import {
  SUPPLIER_TRADE_STATUS,
  formatBusinessNumber,
  normalizeBusinessNumber,
} from "@/features/supplier/utils/supplierManagementUtils"

const INPUT_CLASS_NAME =
  "h-10 w-full rounded-md border border-slate-200 px-3 text-[14px] text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"

function FieldLabel({ children, required = false }) {
  return (
    <span className="mb-1 block text-[13px] font-semibold text-slate-600">
      {children}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
    </span>
  )
}

function TextField({ label, required = false, ...props }) {
  return (
    <label>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input className={INPUT_CLASS_NAME} {...props} />
    </label>
  )
}

function getBusinessNumberMessageClass(state) {
  if (state === "valid") {
    return "text-emerald-600"
  }

  if (state === "invalid" || state === "error") {
    return "text-rose-600"
  }

  return "text-slate-400"
}

export default function SupplierFormModal({
  open,
  mode,
  initialValues,
  submitting,
  error,
  onClose,
  onSubmit,
  onCheckBusinessNumber,
}) {
  const [values, setValues] = useState(initialValues)
  const [businessNumberStatus, setBusinessNumberStatus] = useState({
    state: "idle",
    message: "",
  })

  const supplierId = values?.supplierId ?? values?.id
  const normalizedBusinessNumber = useMemo(
    () => normalizeBusinessNumber(values?.businessNumber),
    [values?.businessNumber],
  )
  const title = mode === "edit" ? "공급업체 수정" : "공급업체 등록"

  useEffect(() => {
    if (open) {
      setValues(initialValues)
      setBusinessNumberStatus({ state: "idle", message: "" })
    }
  }, [initialValues, open])

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleEscape)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  function updateValue(name, value) {
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))

    if (name === "businessNumber") {
      setBusinessNumberStatus({ state: "idle", message: "" })
    }
  }

  async function verifyBusinessNumber() {
    if (!normalizedBusinessNumber) {
      setBusinessNumberStatus({ state: "idle", message: "" })
      return true
    }

    if (normalizedBusinessNumber.length !== 10) {
      setBusinessNumberStatus({
        state: "invalid",
        message: "사업자등록번호는 숫자 10자리로 입력하세요.",
      })
      return false
    }

    if (!onCheckBusinessNumber) {
      return true
    }

    setBusinessNumberStatus({
      state: "checking",
      message: "사업자등록번호를 확인하는 중입니다.",
    })

    try {
      const exists = await onCheckBusinessNumber(
        normalizedBusinessNumber,
        supplierId,
      )

      if (exists) {
        setBusinessNumberStatus({
          state: "invalid",
          message: "이미 등록된 사업자등록번호입니다.",
        })
        return false
      }

      setBusinessNumberStatus({
        state: "valid",
        message: "사용 가능한 사업자등록번호입니다.",
      })
      return true
    } catch {
      setBusinessNumberStatus({
        state: "error",
        message: "사업자등록번호 중복 확인에 실패했습니다.",
      })
      return false
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!values.supplierName.trim()) {
      return
    }

    const validBusinessNumber = await verifyBusinessNumber()

    if (!validBusinessNumber) {
      return
    }

    onSubmit({
      ...values,
      businessNumber: normalizedBusinessNumber,
    })
  }

  const isCheckingBusinessNumber = businessNumberStatus.state === "checking"
  const canSubmit =
    !submitting &&
    !isCheckingBusinessNumber &&
    Boolean(values.supplierName.trim())

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/45 px-4 py-6 backdrop-blur-[1px]"
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onSubmit={handleSubmit}
        className="w-full max-w-[760px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-blue-600" />
            <h2 className="text-[16px] font-bold text-slate-800">{title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            disabled={submitting}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </header>

        <div className="grid gap-4 px-5 py-4 md:grid-cols-2">
          <TextField
            label="공급업체 코드"
            value={values.supplierCode}
            onChange={(event) => updateValue("supplierCode", event.target.value)}
            placeholder="미입력 시 자동 생성"
            maxLength={50}
          />

          <TextField
            label="공급업체명"
            required
            value={values.supplierName}
            onChange={(event) => updateValue("supplierName", event.target.value)}
            placeholder="업체명을 입력하세요"
            maxLength={100}
          />

          <div>
            <FieldLabel>사업자등록번호</FieldLabel>
            <div className="flex gap-2">
              <input
                className={INPUT_CLASS_NAME}
                value={values.businessNumber}
                onChange={(event) =>
                  updateValue("businessNumber", event.target.value)
                }
                onBlur={verifyBusinessNumber}
                placeholder="000-00-00000"
                maxLength={12}
                inputMode="numeric"
              />
              <button
                type="button"
                onClick={verifyBusinessNumber}
                disabled={isCheckingBusinessNumber}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCheckingBusinessNumber ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={14} />
                )}
                중복 확인
              </button>
            </div>
            <p
              className={`mt-1 text-[12px] ${getBusinessNumberMessageClass(
                businessNumberStatus.state,
              )}`}
            >
              {businessNumberStatus.message ||
                (normalizedBusinessNumber
                  ? `저장 형식: ${formatBusinessNumber(normalizedBusinessNumber)}`
                  : "숫자 10자리로 입력하면 중복 여부를 확인합니다.")}
            </p>
          </div>

          <TextField
            label="담당자"
            value={values.manager}
            onChange={(event) => updateValue("manager", event.target.value)}
            placeholder="담당자명"
            maxLength={100}
          />

          <TextField
            label="연락처"
            value={values.phone}
            onChange={(event) => updateValue("phone", event.target.value)}
            placeholder="010-0000-0000"
            maxLength={50}
          />

          <TextField
            label="이메일"
            type="email"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            placeholder="supplier@example.com"
            maxLength={100}
          />

          <label>
            <FieldLabel>거래 상태</FieldLabel>
            <select
              value={values.tradeStatus}
              onChange={(event) => updateValue("tradeStatus", event.target.value)}
              className={`${INPUT_CLASS_NAME} bg-white`}
            >
              <option value={SUPPLIER_TRADE_STATUS.ACTIVE}>거래중</option>
              <option value={SUPPLIER_TRADE_STATUS.STOPPED}>거래중지</option>
            </select>
          </label>

          <TextField
            label="주소"
            value={values.address}
            onChange={(event) => updateValue("address", event.target.value)}
            placeholder="주소"
            maxLength={500}
          />

          {error && (
            <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-[13px] font-semibold text-rose-600 md:col-span-2">
              {error}
            </div>
          )}
        </div>

        <footer className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="h-10 rounded-md border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            취소
          </button>

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex h-10 items-center gap-1.5 rounded-md bg-blue-600 px-4 text-[13px] font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {submitting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {submitting ? "저장 중" : "저장"}
          </button>
        </footer>
      </form>
    </div>
  )
}
