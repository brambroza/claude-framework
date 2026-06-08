'use client'
import { costs, clients } from '@/data/mockData'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function CostsPage() {
  const totalBudget = clients.reduce((s,c)=>s+c.budget,0)
  const totalSpent = clients.reduce((s,c)=>s+c.spent,0)
  const thisMonth = costs[costs.length-1]
  const overBudgetMonths = costs.filter(c=>c.actual>c.budget).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Costs</h1>
        <p className="text-sm text-gray-500 mt-0.5">ต้นทุน งบประมาณ และ Claude token usage</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Budget รวมทุก project', value:`฿${(totalBudget/1000000).toFixed(1)}M`, color:'text-gray-900' },
          { label:'Spent รวม', value:`฿${(totalSpent/1000000).toFixed(2)}M`, color:'text-amber-600' },
          { label:'Remaining', value:`฿${((totalBudget-totalSpent)/1000).toFixed(0)}k`, color:'text-green-600' },
          { label:'Claude tokens/เดือนนี้', value:`${thisMonth.claudeTokens.toLocaleString()}`, color:'text-brand-500' },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Budget vs Actual chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-4">Budget vs Actual (บาท/เดือน)</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={costs} margin={{top:0,right:0,left:0,bottom:0}}>
            <XAxis dataKey="month" tick={{fontSize:12}} />
            <YAxis tick={{fontSize:11}} tickFormatter={v=>`฿${v/1000}k`} />
            <Tooltip formatter={(v:number)=>`฿${v.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="budget" fill="#CECBF6" name="Budget" radius={[4,4,0,0]} />
            <Bar dataKey="actual" fill="#534AB7" name="Actual" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-project budget */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-4">งบประมาณแต่ละ Project</p>
        <div className="space-y-4">
          {clients.map(c => {
            const pct = Math.round((c.spent/c.budget)*100)
            return (
              <div key={c.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-900">{c.name}</span>
                  <span className="text-gray-500">฿{(c.spent/1000).toFixed(0)}k / ฿{(c.budget/1000).toFixed(0)}k <span className={pct>80?'text-red-500 font-semibold':'text-gray-400'}>({pct}%)</span></span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${pct>80?'bg-red-400':pct>60?'bg-amber-400':'bg-brand-500'}`} style={{width:`${pct}%`}}></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Claude token trend */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-1">Claude Token Usage (รายเดือน)</p>
        <p className="text-xs text-gray-400 mb-4">ยิ่งใช้เยอะ = ทีมใช้ Claude Code มากขึ้น = ประสิทธิภาพดีขึ้น</p>
        <div className="flex items-end gap-3 h-24">
          {costs.map(c => {
            const maxTokens = Math.max(...costs.map(x=>x.claudeTokens))
            const h = Math.round((c.claudeTokens/maxTokens)*100)
            return (
              <div key={c.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">{(c.claudeTokens/1000).toFixed(1)}k</span>
                <div className="w-full bg-brand-200 rounded-t" style={{height:`${h}%`, minHeight:'8px'}}></div>
                <span className="text-xs text-gray-400">{c.month}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
