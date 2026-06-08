import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client')
    const status = searchParams.get('status')

    let sql = `
      SELECT
        t.id, t.title, t.status, t.priority, t.phase,
        t.due_date, t.tags, t.created_at,
        t.client_id,
        c.name AS client_name,
        t.assignee_id,
        m.name AS assignee_name,
        m.avatar AS assignee_avatar,
        m.color AS assignee_color
      FROM tasks t
      LEFT JOIN clients c ON t.client_id = c.id
      LEFT JOIN members m ON t.assignee_id = m.id
      WHERE 1=1
    `
    const params: Record<string, any> = {}

    if (clientId) { sql += ' AND t.client_id = @clientId'; params.clientId = clientId }
    if (status)   { sql += ' AND t.status = @status';     params.status = status }

    sql += ' ORDER BY t.created_at DESC'

    const rows = await query(sql, params)
    return NextResponse.json(rows)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, client_id, assignee_id, priority, phase, due_date, tags } = body

    if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })

    const rows = await query(`
      INSERT INTO tasks (title, client_id, assignee_id, priority, phase, due_date, tags)
      OUTPUT INSERTED.*
      VALUES (@title, @client_id, @assignee_id, @priority, @phase, @due_date, @tags)
    `, { title, client_id, assignee_id, priority: priority||'medium', phase, due_date, tags })

    return NextResponse.json(rows[0], { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
