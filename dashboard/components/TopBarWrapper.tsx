'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { AuthPayload } from '@/lib/auth'

const ROLE_BADGE: Record<string, string> = {
  admin:  'bg-red-50 text-red-700',
  editor: 'bg-brand-50 text-brand-700',
  viewer: 'bg-gray-100 text-gray-500',
}

export default function TopBarWrapper() {
  const router = useRouter()
  const [user, setUser] = useState<AuthPayload | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [today, setToday] = useState('')

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(setUser)
    setToday(new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
  }, [])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const initials = user?.name?.slice(0, 2) ?? '??'

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 relative z-20">
      <div>
        <p className="text-xs text-gray-400">{today}</p>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-2 py-1 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-semibold">
                {initials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900 leading-none">{user.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
              </div>
              <span className={`badge hidden sm:inline-flex ${ROLE_BADGE[user.role]}`}>{user.role}</span>
              <span className="text-gray-400 text-xs">▾</span>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-gray-100 shadow-lg w-44 py-1 z-30">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-xs font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
