import { apiFetch } from "@/lib/api/fetchClient"
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from "@/features/auth/utils/authStorage"

export async function login(payload) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function loadMe() {
  return apiFetch("/api/auth/me", {
    method: "GET",
    cache: "no-store",
  })
}

export async function signup(payload) {
  return apiFetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function requestFindLoginIdCode(payload) {
  return apiFetch("/api/auth/find-login-id/code", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function verifyFindLoginIdCode(payload) {
  return apiFetch("/api/auth/find-login-id/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function requestPasswordResetCode(payload) {
  return apiFetch("/api/auth/reset-password/code", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function verifyPasswordResetCode(payload) {
  return apiFetch("/api/auth/reset-password/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function confirmPasswordReset(payload) {
  return apiFetch("/api/auth/reset-password/confirm", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getCurrentUser() {
  return getAuthSession()?.user ?? null
}

export function logout() {
  clearAuthSession()
}

export async function loginAndSave(payload, remember = true) {
  const session = await login(payload)

  saveAuthSession(session, remember)

  return session
}
