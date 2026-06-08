'use client'
import { goals, members } from '@/data/mockData'

export default function GoalsPage() {
  const statusConfig: Record<string,{cls:string,label:string}> = {
    'on-track': { cls:'bg-green-50 text-green-700', label:'On Track' },
    'at-risk': { cls:'bg-amber-50 text-amber-700', label:'At Risk' },
    'behind': { cls:'bg-red-50 text-red-700', label:'Behind' },
    'done': { cls:'bg-gray-100 text-gray-600', label:'Done' },
  }
  const overall = Math.round(goals.reduce((s,g)=>s+g.progress,0)/goals.length)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Goals</h1>
        <p className="text-sm text-gray-500 mt-0.5">เป้าหมายของทีมและองค์กร</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card col-span-1">
          <p className="text-xs text-gray-400 mb-1">Overall progress</p>
          <p className="text-3xl font-semibold text-brand-500">{overall}%</p>
        </div>
        {[
          { label:'On Track', count: goals.filter(g=>g.status==='on-track').length, color:'text-green-600' },
          { label:'At Risk', count: goals.filter(g=>g.status==='at-risk').length, color:'text-amber-600' },
          { label:'Completed', count: goals.filter(g=>g.status==='done').length, color:'text-gray-600' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.count}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {goals.map(g => {
          const owner = members.find(m=>m.id===g.owner)
          const { cls, label } = statusConfig[g.status]
          return (
            <div key={g.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900">{g.title}</p>
                    <span className={`badge ${cls}`}>{label}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{g.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${g.status==='at-risk'?'bg-amber-400':'bg-brand-500'}`}
                        style={{width:`${g.progress}%`}}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-10 text-right">{g.progress}%</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold mb-1 ${owner?.color}`}>{owner?.avatar}</div>
                  <p className="text-xs text-gray-400">{new Date(g.dueDate).toLocaleDateString('th-TH')}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
