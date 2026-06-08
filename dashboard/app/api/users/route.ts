import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME, isAdmin } from '@/lib/auth'

async function requireAdmin() {
  const token = cookies().get(COOKIE_NAME)?.value
  const user = token ? await verifyToken(token) : null
  if (!user || !isAdmin(user.role)) return null
  return user
}

export async function GET() {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ error: 'ต้องเป็น Admin' }, { status: 403 })

  try {
    const rows = await query(`
      SELECT id, email, name, role, member_id, is_active, last_login, created_at
      FROM users
      ORDER BY created_at
    `)
    return NextResponse.json(rows)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ error: 'ต้องเป็น Admin' }, { status: 403 })

  try {
    const { email, name, role, password, member_id } = await request.json()
    if (!email || !name || !password) {
      return NextResponse.json({ error: 'email, name และ password จำเป็น' }, { status: 400 })
    }
    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return NextResponse.json({ error: 'role ไม่ถูกต้อง' }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 12)
    await query(`
      INSERT INTO users (email, name, password_hash, role, member_id)
      VALUES (@email, @name, @hash, @role, @member_id)
    `, { email: email.toLowerCase().trim(), name, hash, role: role || 'viewer', member_id: member_id || null })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err: any) {
    if (err.message?.includes('UNIQUE') || err.message?.includes('unique')) {
      return NextResponse.json({ error: 'Email นี้ถูกใช้แล้ว' }, { status: 409 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
