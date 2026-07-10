// src/lib/file/downloadFile.js

export function getFileNameFromDisposition(disposition, fallbackFileName) {
  if (!disposition) return fallbackFileName

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1])
  }

  const normalMatch = disposition.match(/filename="?([^"]+)"?/i)
  if (normalMatch?.[1]) {
    return decodeURIComponent(normalMatch[1])
  }

  return fallbackFileName
}

export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = fileName

  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}

export function downloadCsvFile(rows, fileName) {
  const csv = rows
    .map((row) =>
      row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(","),
    )
    .join("\n")

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  })

  downloadBlob(blob, fileName)
}