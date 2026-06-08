'use client'
import { useState } from 'react'
import { tasks, issues, activities, members, clients } from '@/data/mockData'

export default function ActivityPage() {
  const [tab, setTab] = useState<'tasks'|'issues'|'activity'>('tasks')
  const [filter, setFilter] = useState('all')

  const allClients = ['all', ...clients.map(c=>c.id)]

  const filteredTasks = filter==='all' ? tasks : tasks.filter(t=>t.client===filter)
  const filteredIssues = filter==='all' ? issues : issues.filter(i=>i.client===filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Tasks & Issues</h1>
          <p className="text-sm text-gray-500 mt-0.5">จัดการงานและปัญหาทุก project</p>
        </div>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
          value={filter} onChange={e=>setFilter(e.target.value)}>
          {allClients.map(c => (
            <option key={c} value={c}>{c==='all'?'ทุก Client':clients.find(cl=>cl.id===c)?.name}</option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['tasks','issues','activity'] as const).map(t => (
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab===t?'bg-white text-gray-900 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>
            {t==='tasks'?`Tasks (${filteredTasks.length})`:t==='issues'?`Issues (${filteredIssues.filter(i=>i.status!=='resolved').length})`:'Activity'}
          </button>
        ))}
      </div>

      {tab==='tasks' && <TasksTable tasks={filteredTasks} />}
      {tab==='issues' && <IssuesTable issues={filteredIssues} />}
      {tab==='activity' && <ActivityFeed />}
    </div>
  )
}

function TasksTable({ tasks: t }: { tasks: typeof tasks }) {
  const cols: { label:string, key:string }[] = [
    {label:'งาน',key:'title'},{label:'Client',key:'client'},
    {label:'ผู้รับผิดชอบ',key:'assignee'},{label:'Priority',key:'priority'},
    {label:'Status',key:'status'},{label:'Due',key:'due'},
  ]
  const statusColors: Record<string,string> = {
    'todo':'status-todo','in-progress':'status-in-progress','done':'status-done','blocked':'priority-p1'
  }
  const priorityColors: Record<string,string> = { high:'priority-p1', medium:'priority-p2', low:'priority-p3' }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-gray-100 bg-gray-50">
          {cols.map(c=><th key={c.key} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{c.label}</th>)}
        </tr></thead>
        <tbody>
          {t.map(task => {
            const assignee = members.find(m=>m.id===task.assignee)
            const client = clients.find(c=>c.id===task.client)
            return (
              <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{task.title}</td>
                <td className="px-4 py-3 text-gray-600">{client?.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${assignee?.color}`}>{assignee?.avatar}</div>
                    <span className="text-gray-600">{assignee?.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><span className={priorityColors[task.priority]}>{task.priority}</span></td>
                <td className="px-4 py-3"><span className={statusColors[task.status]}>{task.status}</span></td>
                <td className="px-4 py-3 text-gray-500">{task.due}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function IssuesTable({ issues: iss }: { issues: typeof issues }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-gray-100 bg-gray-50">
          {['ปัญหา','Client','Priority','Status','แจ้งโดย','Assignee','วันที่'].map(h=>(
            <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {iss.map(issue => {
            const assignee = members.find(m=>m.id===issue.assignee)
            const client = clients.find(c=>c.id===issue.client)
            return (
              <tr key={issue.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{issue.title}</p>
                  <div className="flex gap-1 mt-1">{issue.tags.map(tag=>(
                    <span key={tag} className="badge bg-gray-100 text-gray-500">{tag}</span>
                  ))}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">{client?.name}</td>
                <td className="px-4 py-3"><span className={`priority-${issue.priority.toLowerCase()}`}>{issue.priority}</span></td>
                <td className="px-4 py-3"><span className={`status-${issue.status}`}>{issue.status}</span></td>
                <td className="px-4 py-3 text-gray-500">{issue.reporter}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${assignee?.color}`}>{assignee?.avatar}</div>
                    <span className="text-gray-600">{assignee?.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{issue.createdAt}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ActivityFeed() {
  const typeIcon: Record<string,string> = { code:'💻', issue:'🐛', task:'✅', deploy:'🚀', design:'🎨' }
  const typeColor: Record<string,string> = {
    code:'bg-blue-50 text-blue-700', issue:'bg-red-50 text-red-700',
    task:'bg-green-50 text-green-700', deploy:'bg-purple-50 text-purple-700',
    design:'bg-pink-50 text-pink-700'
  }
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="space-y-4">
        {activities.map(a => {
          const member = members.find(m=>m.id===a.member)
          const client = clients.find(c=>c.id===a.client)
          return (
            <div key={a.id} className="flex gap-4 py-3 border-b border-gray-50 last:border-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${member?.color}`}>{member?.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-gray-900">{member?.name}</p>
                  <span className={`badge ${typeColor[a.type]}`}>{typeIcon[a.type]} {a.type}</span>
                  {client && <span className="badge bg-brand-50 text-brand-600">{client.name}</span>}
                  <span className="text-xs text-gray-400 ml-auto">{a.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{a.detail}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
