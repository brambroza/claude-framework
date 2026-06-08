import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const rows = await query(`
      SELECT year_month, display_label AS month, budget, actual, claude_tokens
      FROM monthly_costs
      ORDER BY year_month ASC
    `)
    return NextResponse.json(rows)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
