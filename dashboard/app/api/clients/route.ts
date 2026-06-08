import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, business, phase, progress, start_date, due_date, budget, lead_id, member_ids } = body
    if (!name || !phase) return NextResponse.json({ error: 'name และ phase จำเป็น' }, { status: 400 })

    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()

    await query(`
      INSERT INTO clients (id, name, business, phase, progress, start_date, due_date, budget, lead_id)
      VALUES (@id, @name, @business, @phase, @progress, @start_date, @due_date, @budget, @lead_id)
    `, { id, name, business: business || 'software-house', phase, progress: progress || 0,
         start_date: start_date || null, due_date: due_date || null,
         budget: budget || 0, lead_id: lead_id || null })

    if (member_ids?.length) {
      for (const mid of member_ids) {
        await query(`INSERT INTO client_members (client_id, member_id) VALUES (@cid, @mid)`, { cid: id, mid })
      }
    }

    return NextResponse.json({ id }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const clients = await query(`
      SELECT
        c.id, c.name, c.business, c.phase, c.progress,
        c.start_date, c.due_date, c.budget, c.spent,
        c.lead_id,
        m.name AS lead_name, m.avatar AS lead_avatar, m.color AS lead_color,
        (SELECT COUNT(*) FROM tasks t WHERE t.client_id = c.id AND t.status NOT IN ('done')) AS open_tasks,
        (SELECT COUNT(*) FROM issues i WHERE i.client_id = c.id AND i.status NOT IN ('resolved','closed')) AS open_issues,
        (SELECT COUNT(*) FROM issues i WHERE i.client_id = c.id AND i.priority = 'P1' AND i.status NOT IN ('resolved','closed')) AS p1_issues
      FROM clients c
      LEFT JOIN members m ON c.lead_id = m.id
      ORDER BY c.phase, c.name
    `)

    // เพิ่ม members list ให้แต่ละ client
    for (const client of clients as any[]) {
      const members = await query(`
        SELECT m.id, m.name, m.avatar, m.color, m.role
        FROM client_members cm
        JOIN members m ON cm.member_id = m.id
        WHERE cm.client_id = @cid
      `, { cid: client.id })
      client.members = members
    }

    return NextResponse.json(clients)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
