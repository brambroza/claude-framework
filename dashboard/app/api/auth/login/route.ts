import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'
import { signToken, COOKIE_NAME, COOKIE_MAX_AGE, type AuthPayload, type UserRole } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'กรุณากรอก email และ password' }, { status: 400 })
    }

    const rows = await query(
      `SELECT id, email, name, role, password_hash, is_active FROM users WHERE email = @email`,
      { email: email.toLowerCase().trim() }
    ) as any[]

    const user = rows[0]
    if (!user || !user.is_active) {
      return NextResponse.json({ error: 'Email หรือ password ไม่ถูกต้อง' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Email หรือ password ไม่ถูกต้อง' }, { status: 401 })
    }

    await query(`UPDATE users SET last_login = GETDATE() WHERE id = @id`, { id: user.id })

    const payload: AuthPayload = { id: user.id, email: user.email, name: user.name, role: user.role as UserRole }
    const token = await signToken(payload)

    const response = NextResponse.json({ ok: true, user: payload })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })
    return response
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
