"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle2,
  RefreshCcw,
  Save,
  ShieldCheck,
  UserCheck,
  UsersRound,
} from "lucide-react"
import {
  approveAdminUser,
  fetchAdminRoles,
  fetchAdminUsers,
  updateAdminUserRoles,
  updateAdminUserStatus,
} from "@/features/admin/api/adminUserApi"

const statusOptions = [
  { value: "PENDING", label: "승인 대기" },
  { value: "ACTIVE", label: "사용 중" },
  { value: "LOCKED", label: "잠김" },
  { value: "INACTIVE", label: "비활성" },
]

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-100",
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  LOCKED: "bg-rose-50 text-rose-700 ring-rose-100",
  INACTIVE: "bg-slate-100 text-slate-600 ring-slate-200",
}

function getStatusLabel(status) {
  return statusOptions.find((option) => option.value === status)?.label ?? status
}

function formatDateTime(value) {
  if (!value) {
    return "-"
  }

  return String(value).replace("T", " ").slice(0, 16)
}

function getRoleIds(adminUser) {
  return adminUser?.roles?.map((role) => role.roleId) ?? []
}

function getPreferredUser(userList = []) {
  return (
    userList.find((item) => item.user.status === "PENDING") ??
    userList[0] ??
    null
  )
}

function getUserSelection(adminUser) {
  if (!adminUser) {
    return {
      userId: null,
      status: "PENDING",
      useYn: "Y",
      roleIds: [],
    }
  }

  return {
    userId: adminUser.user.userId,
    status: adminUser.user.status,
    useYn: adminUser.user.useYn,
    roleIds: getRoleIds(adminUser),
  }
}

function normalizeUserName(adminUser) {
  const user = adminUser.user

  return user.userName || user.loginId || `사용자 ${user.userId}`
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState("PENDING")
  const [selectedUseYn, setSelectedUseYn] = useState("Y")
  const [selectedRoleIds, setSelectedRoleIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const selectedUser = useMemo(
    () => users.find((item) => item.user.userId === selectedUserId) ?? null,
    [selectedUserId, users],
  )

  const pendingCount = users.filter(
    (item) => item.user.status === "PENDING",
  ).length
  const activeCount = users.filter((item) => item.user.status === "ACTIVE").length

  async function loadData({ keepSelection = false } = {}) {
    setError("")
    setLoading(true)

    try {
      const [userList, roleList] = await Promise.all([
        fetchAdminUsers(),
        fetchAdminRoles(),
      ])

      setUsers(userList ?? [])
      setRoles(roleList ?? [])

      if (!keepSelection) {
        selectUser(getPreferredUser(userList ?? []))
      }
    } catch (loadError) {
      setError(
        loadError.message ||
          "관리자 데이터를 불러오지 못했습니다. 관리자 권한으로 로그인했는지 확인해 주세요.",
      )
    } finally {
      setLoading(false)
    }
  }

  function selectUser(adminUser) {
    const selection = getUserSelection(adminUser)

    setSelectedUserId(selection.userId)
    setSelectedStatus(selection.status)
    setSelectedUseYn(selection.useYn)
    setSelectedRoleIds(selection.roleIds)
    setMessage("")
  }

  function toggleRole(roleId) {
    setSelectedRoleIds((current) =>
      current.includes(roleId)
        ? current.filter((id) => id !== roleId)
        : [...current, roleId],
    )
  }

  async function refreshAfterWrite(successMessage) {
    const refreshedUsers = await fetchAdminUsers()
    setUsers(refreshedUsers ?? [])
    const refreshedSelected =
      refreshedUsers?.find((item) => item.user.userId === selectedUserId) ??
      null

    selectUser(refreshedSelected)
    setMessage(`${successMessage} 서버에서 다시 조회해 DB 반영을 확인했습니다.`)
  }

  async function handleApprove() {
    if (!selectedUser) {
      return
    }

    setSaving(true)
    setError("")
    setMessage("")

    try {
      await approveAdminUser(selectedUser.user.userId)
      await refreshAfterWrite("회원 승인이 완료되었습니다.")
    } catch (approveError) {
      setError(approveError.message || "회원 승인에 실패했습니다.")
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveStatus() {
    if (!selectedUser) {
      return
    }

    setSaving(true)
    setError("")
    setMessage("")

    try {
      await updateAdminUserStatus(selectedUser.user.userId, {
        status: selectedStatus,
        useYn: selectedUseYn,
      })
      await refreshAfterWrite("회원 상태가 저장되었습니다.")
    } catch (statusError) {
      setError(statusError.message || "회원 상태 저장에 실패했습니다.")
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveRoles() {
    if (!selectedUser) {
      return
    }

    if (selectedRoleIds.length === 0) {
      setError("역할은 최소 1개 이상 선택해야 합니다.")
      return
    }

    setSaving(true)
    setError("")
    setMessage("")

    try {
      await updateAdminUserRoles(selectedUser.user.userId, selectedRoleIds)
      await refreshAfterWrite("회원 역할이 저장되었습니다.")
    } catch (roleError) {
      setError(roleError.message || "회원 역할 저장에 실패했습니다.")
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    let ignore = false

    async function loadInitialData() {
      try {
        const [userList, roleList] = await Promise.all([
          fetchAdminUsers(),
          fetchAdminRoles(),
        ])

        if (ignore) {
          return
        }

        const nextUsers = userList ?? []
        const selection = getUserSelection(getPreferredUser(nextUsers))

        setUsers(nextUsers)
        setRoles(roleList ?? [])
        setSelectedUserId(selection.userId)
        setSelectedStatus(selection.status)
        setSelectedUseYn(selection.useYn)
        setSelectedRoleIds(selection.roleIds)
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError.message ||
              "관리자 데이터를 불러오지 못했습니다. 관리자 권한으로 로그인했는지 확인해 주세요.",
          )
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadInitialData()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[12px] font-semibold text-blue-600">시스템 관리</p>
          <h1 className="mt-1 text-[20px] font-bold text-slate-900">
            회원 승인 및 권한 관리
          </h1>
          <p className="mt-1 text-[12px] text-slate-500">
            가입 대기 회원을 승인하고 사용자별 역할을 부여합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadData({ keepSelection: true })}
          disabled={loading || saving}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw size={14} />
          새로고침
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <SummaryCard
          icon={UsersRound}
          label="전체 회원"
          value={users.length}
          note="DB USERS 기준"
        />
        <SummaryCard
          icon={UserCheck}
          label="승인 대기"
          value={pendingCount}
          note="PENDING 상태"
        />
        <SummaryCard
          icon={ShieldCheck}
          label="사용 중"
          value={activeCount}
          note="ACTIVE 상태"
        />
      </div>

      {error && (
        <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-600">
          {error}
        </p>
      )}

      {message && (
        <p className="rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2 text-[12px] font-medium text-emerald-700">
          {message}
        </p>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-[14px] font-bold text-slate-800">회원 목록</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[12px]">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">아이디</th>
                  <th className="px-4 py-3 font-semibold">이름</th>
                  <th className="px-4 py-3 font-semibold">상태</th>
                  <th className="px-4 py-3 font-semibold">역할</th>
                  <th className="px-4 py-3 font-semibold">가입일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      회원 목록을 불러오는 중입니다.
                    </td>
                  </tr>
                )}

                {!loading &&
                  users.map((adminUser) => {
                    const user = adminUser.user
                    const selected = user.userId === selectedUserId

                    return (
                      <tr
                        key={user.userId}
                        onClick={() => selectUser(adminUser)}
                        className={`cursor-pointer transition hover:bg-blue-50/60 ${
                          selected ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {user.loginId}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {user.userName}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {adminUser.roles?.map((role) => role.roleCode).join(", ") ||
                            "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {formatDateTime(user.createdAt)}
                        </td>
                      </tr>
                    )
                  })}

                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      등록된 회원이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <UserDetailPanel
          user={selectedUser}
          roles={roles}
          selectedStatus={selectedStatus}
          selectedUseYn={selectedUseYn}
          selectedRoleIds={selectedRoleIds}
          saving={saving}
          onChangeStatus={setSelectedStatus}
          onChangeUseYn={setSelectedUseYn}
          onToggleRole={toggleRole}
          onApprove={handleApprove}
          onSaveStatus={handleSaveStatus}
          onSaveRoles={handleSaveRoles}
        />
      </div>
    </section>
  )
}

function SummaryCard({ icon: Icon, label, value, note }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] text-slate-500">{label}</p>
          <strong className="mt-1 block text-[24px] text-slate-900">
            {value}
          </strong>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
          <Icon size={17} />
        </span>
      </div>
      <p className="mt-2 text-[11px] text-slate-400">{note}</p>
    </article>
  )
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-2 text-[11px] font-bold ring-1 ${
        statusStyles[status] ?? statusStyles.INACTIVE
      }`}
    >
      {getStatusLabel(status)}
    </span>
  )
}

function UserDetailPanel({
  user,
  roles,
  selectedStatus,
  selectedUseYn,
  selectedRoleIds,
  saving,
  onChangeStatus,
  onChangeUseYn,
  onToggleRole,
  onApprove,
  onSaveStatus,
  onSaveRoles,
}) {
  if (!user) {
    return (
      <aside className="rounded-lg border border-slate-200 bg-white p-5 text-center text-[12px] text-slate-400 shadow-sm">
        회원을 선택하면 상세 정보와 승인 버튼이 표시됩니다.
      </aside>
    )
  }

  const currentUser = user.user
  const canApprove = currentUser.status === "PENDING"

  return (
    <aside className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-[14px] font-bold text-slate-800">회원 상세</h2>
      </div>

      <div className="space-y-5 p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[18px] font-bold text-slate-900">
                {normalizeUserName(user)}
              </p>
              <p className="mt-1 text-[12px] text-slate-500">
                {currentUser.loginId}
              </p>
            </div>
            <StatusBadge status={currentUser.status} />
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
            <InfoItem label="이메일" value={currentUser.email || "-"} />
            <InfoItem label="연락처" value={currentUser.phone || "-"} />
            <InfoItem label="사용 여부" value={currentUser.useYn} />
            <InfoItem label="최근 로그인" value={formatDateTime(currentUser.lastLoginAt)} />
            <InfoItem label="가입일" value={formatDateTime(currentUser.createdAt)} />
            <InfoItem label="수정일" value={formatDateTime(currentUser.updatedAt)} />
          </dl>
        </div>

        <div className="rounded-md border border-slate-200 p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[13px] font-bold text-slate-800">가입 승인</p>
              <p className="mt-1 text-[11px] text-slate-400">
                승인하면 상태가 ACTIVE로 저장됩니다.
              </p>
            </div>
            <button
              type="button"
              onClick={onApprove}
              disabled={!canApprove || saving}
              className="inline-flex h-8 items-center gap-1 rounded-md bg-emerald-500 px-3 text-[12px] font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <CheckCircle2 size={14} />
              승인
            </button>
          </div>
        </div>

        <div className="space-y-3 rounded-md border border-slate-200 p-3">
          <p className="text-[13px] font-bold text-slate-800">상태 변경</p>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[11px] font-bold text-slate-600">
              계정 상태
              <select
                value={selectedStatus}
                onChange={(event) => onChangeStatus(event.target.value)}
                className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-[12px] outline-none focus:border-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-[11px] font-bold text-slate-600">
              사용 여부
              <select
                value={selectedUseYn}
                onChange={(event) => onChangeUseYn(event.target.value)}
                className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-[12px] outline-none focus:border-blue-500"
              >
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={onSaveStatus}
            disabled={saving}
            className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-md border border-blue-200 bg-blue-50 text-[12px] font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={14} />
            상태 저장
          </button>
        </div>

        <div className="space-y-3 rounded-md border border-slate-200 p-3">
          <p className="text-[13px] font-bold text-slate-800">역할 부여</p>

          <div className="space-y-2">
            {roles.map((role) => (
              <label
                key={role.roleId}
                className="flex cursor-pointer items-start gap-2 rounded-md border border-slate-100 p-2 transition hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={selectedRoleIds.includes(role.roleId)}
                  onChange={() => onToggleRole(role.roleId)}
                  className="mt-0.5 h-4 w-4 accent-blue-500"
                />
                <span>
                  <span className="block text-[12px] font-bold text-slate-700">
                    {role.roleName}{" "}
                    <span className="font-mono text-[11px] text-blue-600">
                      {role.roleCode}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[11px] text-slate-400">
                    {role.description}
                  </span>
                </span>
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={onSaveRoles}
            disabled={saving}
            className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-md border border-blue-200 bg-blue-50 text-[12px] font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={14} />
            역할 저장
          </button>
        </div>
      </div>
    </aside>
  )
}

function InfoItem({ label, value }) {
  return (
    <div>
      <dt className="text-[11px] font-bold text-slate-400">{label}</dt>
      <dd className="mt-1 break-words font-medium text-slate-700">{value}</dd>
    </div>
  )
}
