'use client'
import { useState, useEffect } from 'react'
import type { AgentInfo } from '@/app/api/agents/route'

const phaseColors: Record<string, string> = {
  presales: 'bg-purple-50 text-purple-700',
  planning: 'bg-blue-50 text-blue-700',
  delivery: 'bg-amber-50 text-amber-700',
  handover: 'bg-teal-50 text-teal-700',
  support: 'bg-green-50 text-green-700',
  all: 'bg-gray-100 text-gray-600',
}

const modelColors: Record<string, string> = {
  inherit: 'bg-gray-100 text-gray-500',
  sonnet: 'bg-brand-50 text-brand-600',
  opus: 'bg-violet-50 text-violet-700',
  haiku: 'bg-sky-50 text-sky-700',
}

const memoryColors: Record<string, string> = {
  user: 'bg-pink-50 text-pink-700',
  project: 'bg-orange-50 text-orange-700',
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/agents')
      .then(r => r.json())
      .then(data => { setAgents(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const phases = ['all', 'presales', 'planning', 'delivery', 'handover', 'support']
  const filtered = filter === 'all' ? agents : agents.filter(a => a.phase === filter)
  const overrideCount = agents.filter(a => a.model !== 'inherit').length
  const memoryCount = agents.filter(a => a.memory).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Agents</h1>
          <p className="text-sm text-gray-500 mt-0.5">กำลังโหลด agents จากระบบ…</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse h-28" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Agents</h1>
        <p className="text-sm text-gray-500 mt-0.5">Agents ทั้งหมดในระบบ — ใช้ด้วย @agent-name</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-xs text-gray-400 mb-1">Agents ทั้งหมด</p>
          <p className="text-2xl font-semibold text-gray-900">{agents.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-gray-400 mb-1">Model override</p>
          <p className="text-2xl font-semibold text-brand-500">{overrideCount}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-gray-400 mb-1">มี Memory</p>
          <p className="text-2xl font-semibold text-pink-500">{memoryCount}</p>
        </div>
      </div>

      {/* Phase filter */}
      <div className="flex gap-2 flex-wrap">
        {phases.map(p => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === p
                ? 'bg-brand-500 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {p === 'all' ? 'ทั้งหมด' : p}
            {p !== 'all' && (
              <span className="ml-1.5 text-xs opacity-60">
                {agents.filter(a => a.phase === p).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(agent => (
          <div key={agent.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-sm font-mono font-semibold text-gray-900">@{agent.name}</p>
              <span className={`badge text-xs ${phaseColors[agent.phase]}`}>{agent.phase}</span>
            </div>

            <p className="text-sm text-gray-500 mb-3 leading-relaxed">{agent.description}</p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={`badge ${modelColors[agent.model] ?? modelColors.inherit}`}>
                {agent.model === 'inherit' ? 'inherit model' : `model: ${agent.model}`}
              </span>
              {agent.memory && (
                <span className={`badge ${memoryColors[agent.memory] ?? 'bg-gray-100 text-gray-500'}`}>
                  {agent.memory} memory
                </span>
              )}
              {agent.source === 'project' && (
                <span className="badge bg-amber-50 text-amber-700">project</span>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-50">
              <code className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
                @{agent.name} [บอก context + งานที่ต้องการ]
              </code>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <p className="text-sm text-gray-400 text-center py-12">ไม่มี agent ใน phase นี้</p>
      )}
    </div>
  )
}
