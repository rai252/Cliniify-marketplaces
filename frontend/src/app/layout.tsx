import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import UserStore from '@/context/user'
import Favicon from './favicon.png'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cliniify',
  description: 'Search Hospitals, Clinics and Doctors',
  icons: [{ rel: 'icon', url: Favicon.src }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Suspense>
          <UserStore>{children}</UserStore>
        </Suspense>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
