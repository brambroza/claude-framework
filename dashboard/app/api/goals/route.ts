import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        g.id, g.title, g.description, g.progress,
        g.due_date, g.status, g.owner_id,
        m.name AS owner_name, m.avatar AS owner_avatar, m.color AS owner_color
      FROM goals g
      LEFT JOIN members m ON g.owner_id = m.id
      ORDER BY g.status, g.due_date
    `)
    return NextResponse.json(rows)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, progress, status } = body
    await query(`
      UPDATE goals SET progress=@progress, status=@status, updated_at=GETDATE()
      WHERE id=@id
    `, { id, progress, status })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
