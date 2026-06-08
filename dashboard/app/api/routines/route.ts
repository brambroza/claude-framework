import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const routines = await query(`
      SELECT id, name, schedule, prompt_template AS prompt,
             last_run, next_run, is_active
      FROM routines
      WHERE is_active = 1
      ORDER BY name
    `)

    for (const r of routines as any[]) {
      const members = await query(`
        SELECT m.id, m.name, m.avatar, m.color
        FROM routine_members rm
        JOIN members m ON rm.member_id = m.id
        WHERE rm.routine_id = @rid
      `, { rid: r.id })
      r.participants = members
    }

    return NextResponse.json(routines)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
