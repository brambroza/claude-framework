'use client'
import { useEffect, useState } from 'react'

async function fetchJSON(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: ${res.status}`)
  return res.json()
}

export default function DashboardPage() {
  const [members, setMembers] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [issues, setIssues] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    Promise.all([
      fetchJSON('/api/members'), fetchJSON('/api/tasks'),
      fetchJSON('/api/issues'), fetchJSON('/api/activity?limit=10'),
      fetchJSON('/api/clients'),
    ]).then(([m,t,i,a,c]) => {
      setMembers(m); setTasks(t); setIssues(i); setActivities(a); setClients(c)
    }).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const [m,t,i,a] = await Promise.all([
          fetchJSON('/api/members'), fetchJSON('/api/tasks'),
          fetchJSON('/api/issues'), fetchJSON('/api/activity?limit=10'),
        ])
        setMembers(m); setTasks(t); setIssues(i); setActivities(a)
      } catch {}
    }, 30000)
    return () => clearInterval(id)
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-gray-500">กำลังโหลดข้อมูลจาก MSSQL...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto mt-8">
      <p className="text-sm font-semibold text-red-800 mb-2">ไม่สามารถเชื่อมต่อ Database ได้</p>
      <p className="text-xs text-red-600 mb-4 font-mono">{error}</p>
      <div className="text-left bg-white rounded-lg p-4 text-xs text-gray-600 space-y-1">
        <p className="font-semibold">ตรวจสอบ:</p>
        <p>1. แก้ .env.local ให้ถูกต้อง (MSSQL_PASSWORD)</p>
        <p>2. npm run db:migrate</p>
        <p>3. npm run db:seed</p>
        <p>4. SQL Server เปิดอยู่ port 1433</p>
      </div>
    </div>
  )

  const activeMembers = members.filter((m:any) => m.status === 'active')
  const inProgressTasks = tasks.filter((t:any) => t.status === 'in-progress')
  const doneTasks = tasks.filter((t:any) => t.status === 'done')
  const openIssues = issues.filter((i:any) => !['resolved','closed'].includes(i.status))
  const p1Issues = issues.filter((i:any) => i.priority === 'P1' && !['resolved','closed'].includes(i.status))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">ภาพรวมวันนี้</h1>
          <p className="text-sm text-gray-500 mt-0.5">ข้อมูลจาก MSSQL — refresh ทุก 30 วินาที</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>Live
        </span>
      </div>

      {p1Issues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-red-800 mb-1">🚨 {p1Issues.length} P1 Issue ต้องแก้ด่วน</p>
          {p1Issues.map((i:any) => <p key={i.id} className="text-xs text-red-700">• {i.title} — {i.assignee_name||'ยังไม่มีคนรับ'}</p>)}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'คนทำงานวันนี้', value:`${activeMembers.length}/${members.length}`, sub:'ออนไลน์', color:'text-green-600' },
          { label:'Tasks กำลังทำ', value:inProgressTasks.length, sub:`เสร็จแล้ว ${doneTasks.length}`, color:'text-blue-600' },
          { label:'Open Issues', value:openIssues.length, sub:`${p1Issues.length} P1`, color:p1Issues.length>0?'text-red-600':'text-gray-600' },
          { label:'Active Projects', value:clients.filter((c:any)=>c.phase!=='presales').length, sub:`${clients.length} clients`, color:'text-brand-500' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <p className="section-title">ทีมวันนี้</p>
          {members.map((m:any) => (
            <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${m.color}`}>{m.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{m.name}</p>
                  <span className="text-xs text-gray-400">{m.role}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${m.status==='active'?'bg-green-500':m.status==='meeting'?'bg-amber-400':'bg-gray-300'}`}></span>
                </div>
                <p className="text-xs text-gray-500 truncate">{m.current_task||'—'}</p>
              </div>
              {m.client_name && <span className="badge bg-brand-50 text-brand-600">{m.client_name}</span>}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="section-title">Activity ล่าสุด</p>
          <div className="space-y-3">
            {activities.map((a:any) => (
              <div key={a.id} className="flex gap-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${a.member_color||'bg-gray-100'}`}>{a.member_avatar||'?'}</div>
                <div>
                  <p className="text-xs text-gray-900">{a.detail}</p>
                  <p className="text-xs text-gray-400">{a.time} • {a.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="section-title">Tasks กำลังทำ ({inProgressTasks.length})</p>
          <div className="space-y-2">
            {inProgressTasks.map((t:any) => (
              <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority==='high'?'bg-red-400':t.priority==='medium'?'bg-amber-400':'bg-gray-300'}`}></span>
                <p className="text-sm flex-1 truncate">{t.title}</p>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${t.assignee_color||'bg-gray-100'}`}>{t.assignee_avatar}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="section-title">Open Issues ({openIssues.length})</p>
          <div className="space-y-2">
            {openIssues.map((i:any) => (
              <div key={i.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50">
                <span className={`badge ${i.priority==='P1'?'priority-p1':i.priority==='P2'?'priority-p2':'priority-p3'}`}>{i.priority}</span>
                <p className="text-sm flex-1 truncate">{i.title}</p>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${i.assignee_color||'bg-gray-100'}`}>{i.assignee_avatar||'?'}</div>
              </div>
            ))}
            {openIssues.length===0 && <p className="text-sm text-gray-400 text-center py-4">ไม่มี open issues 🎉</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="section-title">Project Progress</p>
        <div className="space-y-4">
          {clients.map((c:any) => (
            <div key={c.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{c.name}</p>
                  <span className={`badge ${c.phase==='delivery'?'bg-amber-50 text-amber-700':c.phase==='planning'?'bg-blue-50 text-blue-700':'bg-purple-50 text-purple-700'}`}>{c.phase}</span>
                  {c.p1_issues>0 && <span className="badge bg-red-50 text-red-700">🚨 {c.p1_issues} P1</span>}
                </div>
                <span className="text-sm text-gray-500">{c.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{width:`${c.progress}%`}}></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">{c.open_tasks} tasks · {c.open_issues} issues</span>
                <span className="text-xs text-gray-400">฿{((c.spent||0)/1000).toFixed(0)}k / ฿{((c.budget||0)/1000).toFixed(0)}k</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
