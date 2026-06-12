import "./globals.css"

export const metadata = {
  title: "BuyFlow ERP",
  description: "구매 요청, 승인, 발주, 입고를 관리하는 구매관리 ERP",
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
