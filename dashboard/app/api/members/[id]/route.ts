import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, role, avatar, color, status, current_task } = body

    await query(`
      UPDATE members SET
        name         = COALESCE(@name, name),
        role         = COALESCE(@role, role),
        avatar       = COALESCE(@avatar, avatar),
        color        = COALESCE(@color, color),
        status       = COALESCE(@status, status),
        current_task = @current_task,
        updated_at   = GETDATE()
      WHERE id = @id
    `, { id, name: name ?? null, role: role ?? null, avatar: avatar ?? null,
         color: color ?? null, status: status ?? null,
         current_task: current_task ?? null })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await query(`DELETE FROM routine_members WHERE member_id = @id`, { id })
    await query(`DELETE FROM client_members  WHERE member_id = @id`, { id })
    await query(`UPDATE tasks   SET assignee_id = NULL WHERE assignee_id = @id`, { id })
    await query(`UPDATE issues  SET assignee_id = NULL WHERE assignee_id = @id`, { id })
    await query(`UPDATE clients SET lead_id     = NULL WHERE lead_id     = @id`, { id })
    await query(`UPDATE members SET client_id   = NULL WHERE client_id   = @id`, { id })
    await query(`DELETE FROM members WHERE id = @id`, { id })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
