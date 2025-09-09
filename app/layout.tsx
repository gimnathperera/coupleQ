import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ConvexClientProvider } from '@/lib/convex-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CoupleQ - TikTok-Style Couple Game',
  description:
    'A fun 2-player real-time couple game with image-based questions',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
            <div className="container mx-auto max-w-md">{children}</div>
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
