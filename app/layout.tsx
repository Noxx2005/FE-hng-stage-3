import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import ServiceWorkerRegistration from '@/components/shared/ServiceWorkerRegistration'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track and build your daily habits',
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/icons/icon-192.png',
        sizes: '192x192',
      },
      {
        url: '/icons/icon-512.png',
        sizes: '512x512',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-blue-50">
      <body className="font-sans antialiased">
        {children}
        <ServiceWorkerRegistration />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
