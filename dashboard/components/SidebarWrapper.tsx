'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import type { AuthPayload } from '@/lib/auth'

const NAV_ITEMS = [
  { href: '/',           icon: '🏠', label: 'Overview' },
  { href: '/routines',   icon: '🔄', label: 'Routines' },
  { href: '/goals',      icon: '🎯', label: 'Goals' },
  { href: '/onboarding', icon: '🚀', label: 'Onboarding' },
  { href: '/agents',     icon: '🤖', label: 'Agents' },
  { href: '/org',        icon: '🏢', label: 'Org' },
  { href: '/skills',     icon: '🔧', label: 'Skills' },
  { href: '/costs',      icon: '💰', label: 'Costs' },
  { href: '/activity',   icon: '⚡', label: 'Activity' },
  { href: '/settings',   icon: '⚙️', label: 'Settings' },
]

const ADMIN_NAV = [
  { href: '/users', icon: '👤', label: 'Users' },
]

export default function SidebarWrapper() {
  const pathname = usePathname()
  const [user, setUser] = useState<AuthPayload | null>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(setUser)
  }, [])

  const allNav = user?.role === 'admin' ? [...NAV_ITEMS, ...ADMIN_NAV] : NAV_ITEMS

  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white text-sm font-bold">G</div>
          <div>
            <p className="text-sm font-semibold text-gray-900">GoAlong</p>
            <p className="text-xs text-gray-400">Framework v4</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {allNav.map(n => {
          const active = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href)
          return (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
              <span className="text-base">{n.icon}</span>
              <span>{n.label}</span>
              {n.href === '/users' && (
                <span className="ml-auto text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">admin</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">Claude Code Framework v4.0</p>
      </div>
    </aside>
  )
}
