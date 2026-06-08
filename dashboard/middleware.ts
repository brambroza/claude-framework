import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { COOKIE_NAME } from '@/lib/auth'

const PUBLIC_PATHS = ['/login', '/api/auth/login']

function getSecret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? 'change-this-secret-in-production-min-32-chars')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Allow Next.js static assets
  if (pathname.startsWith('/_next') || pathname === '/favicon.ico') {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(token, getSecret())

    // Admin-only paths
    if (pathname.startsWith('/users') || pathname.startsWith('/api/users')) {
      if (payload.role !== 'admin') {
        return pathname.startsWith('/api/')
          ? NextResponse.json({ error: 'ไม่มีสิทธิ์' }, { status: 403 })
          : NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Viewer cannot call mutation endpoints
    if (payload.role === 'viewer' && request.method !== 'GET') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Viewer ไม่สามารถแก้ไขข้อมูลได้' }, { status: 403 })
      }
    }

    return NextResponse.next()
  } catch {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete(COOKIE_NAME)
    return response
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
