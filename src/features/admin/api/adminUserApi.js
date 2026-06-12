import { apiFetch } from "@/lib/api/fetchClient"

export function fetchAdminUsers() {
  return apiFetch("/api/admin/users", {
    method: "GET",
    cache: "no-store",
  })
}

export function fetchAdminRoles() {
  return apiFetch("/api/admin/roles", {
    method: "GET",
    cache: "no-store",
  })
}

export function approveAdminUser(userId) {
  return apiFetch(`/api/admin/users/${userId}/approve`, {
    method: "PATCH",
  })
}

export function updateAdminUserStatus(userId, payload) {
  return apiFetch(`/api/admin/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export function updateAdminUserRoles(userId, roleIds) {
  return apiFetch(`/api/admin/users/${userId}/roles`, {
    method: "PUT",
    body: JSON.stringify({ roleIds }),
  })
}
