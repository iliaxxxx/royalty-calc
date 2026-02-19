import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AppProvider } from '@/lib/AppContext'

export const metadata: Metadata = {
  title: 'Vauvision - Калькулятор Роялти',
  description: 'Рассчитайте доход от стриминга на всех платформах',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#f5f5f5',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/liberation-sans"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
