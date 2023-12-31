import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ToasterContext from './context/ToasterContenxt'
import AuthContext from './context/AuthContext'
import ActiveStatus from '@/app/components/ActiveStatus'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'chat App',
  description: 'chat App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>          
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  )
}
