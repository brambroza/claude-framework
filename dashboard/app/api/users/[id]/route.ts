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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ error: 'ต้องเป็น Admin' }, { status: 403 })

  try {
    const { name, role, password, is_active, member_id } = await request.json()
    const { id } = params

    if (role && !['admin', 'editor', 'viewer'].includes(role)) {
      return NextResponse.json({ error: 'role ไม่ถูกต้อง' }, { status: 400 })
    }

    if (password) {
      const hash = await bcrypt.hash(password, 12)
      await query(`UPDATE users SET password_hash = @hash, updated_at = GETDATE() WHERE id = @id`, { hash, id })
    }

    await query(`
      UPDATE users SET
        name      = COALESCE(@name, name),
        role      = COALESCE(@role, role),
        is_active = COALESCE(@is_active, is_active),
        member_id = @member_id,
        updated_at = GETDATE()
      WHERE id = @id
    `, { id, name: name ?? null, role: role ?? null, is_active: is_active ?? null, member_id: member_id ?? null })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth) return NextResponse.json({ error: 'ต้องเป็น Admin' }, { status: 403 })

  if (auth.id === params.id) {
    return NextResponse.json({ error: 'ไม่สามารถลบ account ของตัวเองได้' }, { status: 400 })
  }

  try {
    await query(`DELETE FROM users WHERE id = @id`, { id: params.id })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
