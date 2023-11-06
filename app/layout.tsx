import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Topflix',
  description: 'A multimedia content client',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/castjs/5.2.0/cast.min.js" />
    </html>
  )
}
