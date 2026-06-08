import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, business, phase, progress, start_date, due_date, budget, lead_id, member_ids } = body

    await query(`
      UPDATE clients SET
        name       = COALESCE(@name, name),
        business   = COALESCE(@business, business),
        phase      = COALESCE(@phase, phase),
        progress   = COALESCE(@progress, progress),
        start_date = COALESCE(@start_date, start_date),
        due_date   = COALESCE(@due_date, due_date),
        budget     = COALESCE(@budget, budget),
        lead_id    = @lead_id,
        updated_at = GETDATE()
      WHERE id = @id
    `, { id, name: name ?? null, business: business ?? null, phase: phase ?? null,
         progress: progress ?? null, start_date: start_date ?? null,
         due_date: due_date ?? null, budget: budget ?? null,
         lead_id: lead_id ?? null })

    if (member_ids !== undefined) {
      await query(`DELETE FROM client_members WHERE client_id = @id`, { id })
      for (const mid of member_ids ?? []) {
        await query(`
          IF NOT EXISTS (SELECT 1 FROM client_members WHERE client_id=@cid AND member_id=@mid)
            INSERT INTO client_members (client_id, member_id) VALUES (@cid, @mid)
        `, { cid: id, mid })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await query(`DELETE FROM client_members WHERE client_id = @id`, { id })
    await query(`UPDATE tasks   SET client_id = NULL WHERE client_id = @id`, { id })
    await query(`UPDATE issues  SET client_id = NULL WHERE client_id = @id`, { id })
    await query(`UPDATE activity_log SET client_id = NULL WHERE client_id = @id`, { id })
    await query(`UPDATE members SET client_id = NULL WHERE client_id = @id`, { id })
    await query(`DELETE FROM clients WHERE id = @id`, { id })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
