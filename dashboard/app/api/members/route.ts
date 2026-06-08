import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, role, avatar, color, status } = body
    if (!name || !role) return NextResponse.json({ error: 'name และ role จำเป็น' }, { status: 400 })

    const id = 'm-' + Date.now()
    const av = avatar || (name.slice(0, 2))

    await query(`
      INSERT INTO members (id, name, role, avatar, color, status)
      VALUES (@id, @name, @role, @avatar, @color, @status)
    `, { id, name, role, avatar: av, color: color || 'bg-gray-100 text-gray-700', status: status || 'idle' })

    return NextResponse.json({ id }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        m.id, m.name, m.role, m.avatar, m.color,
        m.status, m.current_task, m.client_id,
        c.name AS client_name,
        (SELECT COUNT(*) FROM tasks t WHERE t.assignee_id = m.id AND t.status = 'in-progress') AS active_tasks,
        (SELECT COUNT(*) FROM tasks t WHERE t.assignee_id = m.id AND t.status = 'todo') AS pending_tasks
      FROM members m
      LEFT JOIN clients c ON m.client_id = c.id
      ORDER BY m.name
    `)
    return NextResponse.json(rows)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
