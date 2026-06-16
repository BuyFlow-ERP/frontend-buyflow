"use client"

import Link from "next/link"

export function AuthFormLayout({ title, description, children }) {
  return (
    <main className="flex min-h-screen flex-col bg-[#f4f9ff] text-slate-900">
      <section className="flex flex-1 items-center justify-center px-5 py-8">
        <div className="w-full max-w-[460px] rounded-lg border border-slate-100 bg-white px-8 py-9 shadow-[0_5px_18px_rgba(15,48,86,0.04)]">
          <header className="text-center">
            <div className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-blue-100">
              <div className="h-9 w-9 rounded-lg bg-blue-500 shadow-sm" />
            </div>

            <h1 className="mt-5 text-[21px] font-bold">{title}</h1>
            <p className="mt-1 text-[11px] font-medium text-blue-700">
              {description}
            </p>
          </header>

          <div className="mt-7">{children}</div>

          <div className="mt-8 text-center text-[11px] font-medium text-blue-700">
            <Link href="/login" className="hover:underline">
              로그인 화면으로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export function AuthInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] font-bold text-slate-700"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-2 h-11 w-full rounded-md border border-blue-200 bg-[#f8fbff] px-3 text-[12px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  )
}

export function AuthMessage({ type = "info", children }) {
  if (!children) {
    return null
  }

  const style =
    type === "error"
      ? "border-red-100 bg-red-50 text-red-600"
      : "border-blue-100 bg-blue-50 text-blue-700"

  return (
    <p
      className={`rounded-md border px-3 py-2 text-[11px] font-medium ${style}`}
    >
      {children}
    </p>
  )
}

export function AuthSubmitButton({ loading, children, loadingText }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-11 w-full items-center justify-center rounded-md bg-blue-500 text-[12px] font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
    >
      {loading ? loadingText : children}
    </button>
  )
}
