import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client')
    const priority = searchParams.get('priority')

    let sql = `
      SELECT
        i.id, i.title, i.reporter, i.priority, i.status,
        i.tags, i.created_at, i.resolved_at,
        i.client_id,
        c.name AS client_name,
        i.assignee_id,
        m.name AS assignee_name,
        m.avatar AS assignee_avatar,
        m.color AS assignee_color
      FROM issues i
      LEFT JOIN clients c ON i.client_id = c.id
      LEFT JOIN members m ON i.assignee_id = m.id
      WHERE 1=1
    `
    const params: Record<string, any> = {}
    if (clientId) { sql += ' AND i.client_id = @clientId'; params.clientId = clientId }
    if (priority) { sql += ' AND i.priority = @priority';  params.priority = priority }

    sql += ' ORDER BY CASE i.priority WHEN \'P1\' THEN 1 WHEN \'P2\' THEN 2 ELSE 3 END, i.created_at DESC'

    const rows = await query(sql, params)
    return NextResponse.json(rows)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, client_id, reporter, assignee_id, priority, tags } = body

    if (!title || !reporter) return NextResponse.json({ error: 'title and reporter required' }, { status: 400 })

    const rows = await query(`
      INSERT INTO issues (title, client_id, reporter, assignee_id, priority, tags)
      OUTPUT INSERTED.*
      VALUES (@title, @client_id, @reporter, @assignee_id, @priority, @tags)
    `, { title, client_id, reporter, assignee_id, priority: priority||'P3', tags })

    return NextResponse.json(rows[0], { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
