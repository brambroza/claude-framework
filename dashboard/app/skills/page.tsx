'use client'
import { skills } from '@/data/mockData'
import { useState } from 'react'

const phaseColors: Record<string,string> = {
  presales:'bg-purple-50 text-purple-700', planning:'bg-blue-50 text-blue-700',
  delivery:'bg-amber-50 text-amber-700', handover:'bg-teal-50 text-teal-700',
  support:'bg-green-50 text-green-700', all:'bg-gray-100 text-gray-600',
}

export default function SkillsPage() {
  const [filter, setFilter] = useState('all')
  const [copied, setCopied] = useState<string|null>(null)
  const phases = ['all','presales','planning','delivery','handover','support']
  const filtered = filter==='all' ? skills : skills.filter(s=>s.phase===filter)

  function copy(id: string, cmd: string) {
    navigator.clipboard.writeText(cmd)
    setCopied(id); setTimeout(()=>setCopied(null),2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Skills</h1>
        <p className="text-sm text-gray-500 mt-0.5">Skills ทั้งหมดใน framework — ใช้ด้วย /skill-name</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {phases.map(p => (
          <button key={p} onClick={()=>setFilter(p)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter===p?'bg-brand-500 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {p==='all'?'ทั้งหมด':p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.sort((a,b)=>b.usageCount-a.usageCount).map(skill => (
          <div key={skill.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-mono font-semibold text-gray-900">{skill.command}</p>
                <div className="flex gap-1.5 mt-1">
                  <span className={`badge ${phaseColors[skill.phase]}`}>{skill.phase}</span>
                  <span className="badge bg-gray-100 text-gray-500">{skill.layer}</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-brand-500">{skill.usageCount}×</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">{skill.description}</p>
            <button onClick={()=>copy(skill.id, skill.command)}
              className={`w-full py-1.5 rounded-lg text-xs font-medium transition-all ${copied===skill.id?'bg-green-50 text-green-700':'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
              {copied===skill.id?'✓ Copied!':'Copy command'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
