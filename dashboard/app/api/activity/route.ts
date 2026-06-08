import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const clientId = searchParams.get('client')

    let sql = `
      SELECT TOP (@limit)
        a.id, a.action, a.detail, a.type,
        FORMAT(a.created_at, 'HH:mm') AS time,
        a.created_at,
        a.member_id,
        m.name AS member_name,
        m.avatar AS member_avatar,
        m.color AS member_color,
        a.client_id,
        c.name AS client_name
      FROM activity_log a
      LEFT JOIN members m ON a.member_id = m.id
      LEFT JOIN clients c ON a.client_id = c.id
      WHERE 1=1
    `
    const params: Record<string, any> = { limit }
    if (clientId) { sql += ' AND a.client_id = @clientId'; params.clientId = clientId }
    sql += ' ORDER BY a.created_at DESC'

    const rows = await query(sql, params)
    return NextResponse.json(rows)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { member_id, action, detail, client_id, type } = body

    await query(`
      INSERT INTO activity_log (member_id, action, detail, client_id, type)
      VALUES (@member_id, @action, @detail, @client_id, @type)
    `, { member_id, action, detail, client_id, type: type||'task' })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
