// src/lib/env/isMockEnabled.js

export function isMockEnabled(envValue) {
  return process.env.NODE_ENV !== "production" && envValue === "true"
}
