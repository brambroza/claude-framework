import type { Metadata } from 'next'
import './globals.css'
import TopBarWrapper from '@/components/TopBarWrapper'
import SidebarWrapper from '@/components/SidebarWrapper'

export const metadata: Metadata = {
  title: 'Claude Framework Dashboard',
  description: 'GoAlong Software House — Framework Monitor',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <div className="flex h-screen overflow-hidden">
          <SidebarWrapper />
          <main className="flex-1 overflow-y-auto">
            <TopBarWrapper />
            <div className="p-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  )
}
