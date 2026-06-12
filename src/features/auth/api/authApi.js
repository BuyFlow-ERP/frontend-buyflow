import { apiFetch } from "@/lib/api/fetchClient"

export function login(payload) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function loadMe() {
  return apiFetch("/api/auth/me", {
    method: "GET",
    cache: "no-store",
  })
}

export function signup(payload) {
  return apiFetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function requestFindLoginIdCode(payload) {
  return apiFetch("/api/auth/find-login-id/code", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function verifyFindLoginIdCode(payload) {
  return apiFetch("/api/auth/find-login-id/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function requestPasswordResetCode(payload) {
  return apiFetch("/api/auth/reset-password/code", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function verifyPasswordResetCode(payload) {
  return apiFetch("/api/auth/reset-password/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function confirmPasswordReset(payload) {
  return apiFetch("/api/auth/reset-password/confirm", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
