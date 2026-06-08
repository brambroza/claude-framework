'use client'
import { members } from '@/data/mockData'
import { useState } from 'react'

const onboardingSteps = [
  { id:'s1', label:'ติดตั้ง Claude Code', command:'npm install -g @anthropic-ai/claude-code', detail:'ต้องการ Node.js 18+ และ Anthropic account' },
  { id:'s2', label:'Clone framework repo', command:'git clone git@github.com:goalong/claude-framework.git', detail:'ขอ access จาก lead ก่อน' },
  { id:'s3', label:'Setup framework', command:'cd claude-framework-v4 && chmod +x scripts/*.sh && ./scripts/setup.sh', detail:'ติดตั้ง core agents และ skills' },
  { id:'s4', label:'Setup org context', command:'./scripts/switch-context.sh software-house --org=goalong', detail:'โหลด GoAlong policies และ rate card' },
  { id:'s5', label:'ดู onboarding guide', command:'/onboard', detail:'รันใน Claude Code เพื่อดู project context ทั้งหมด' },
  { id:'s6', label:'ทดสอบ agent แรก', command:'@org-advisor อธิบาย SLA ของ GoAlong', detail:'ถ้าตอบได้ถูกต้อง — setup สำเร็จ' },
  { id:'s7', label:'Add client ที่รับผิดชอบ', command:'./scripts/add-client.sh [client-id] software-house', detail:'สร้าง CLAUDE.md และ MEMORY.md' },
  { id:'s8', label:'อ่าน MEMORY.md ของ project', command:'cat clients/[client]/memory/MEMORY.md', detail:'ทำความเข้าใจ context ก่อนเริ่มงาน' },
]

export default function OnboardingPage() {
  const [selectedMember, setSelectedMember] = useState('m1')
  const [completed, setCompleted] = useState<Set<string>>(new Set(['s1','s2','s3']))

  function toggle(id: string) {
    const next = new Set(completed)
    next.has(id) ? next.delete(id) : next.add(id)
    setCompleted(next)
  }

  const pct = Math.round((completed.size / onboardingSteps.length) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Onboarding</h1>
        <p className="text-sm text-gray-500 mt-0.5">คู่มือเริ่มต้นสำหรับสมาชิกใหม่ — ทำตามลำดับ</p>
      </div>

      {/* Member selector */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">เลือกสมาชิกที่ onboard</p>
        <div className="flex gap-3 flex-wrap">
          {members.map(m => (
            <button key={m.id} onClick={()=>setSelectedMember(m.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${selectedMember===m.id?'border-brand-300 bg-brand-50':'border-gray-200 hover:border-gray-300'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${m.color}`}>{m.avatar}</div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-400">{m.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Progress</p>
          <span className="text-sm font-semibold text-brand-500">{completed.size}/{onboardingSteps.length} ขั้นตอน ({pct}%)</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all" style={{width:`${pct}%`}}></div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {onboardingSteps.map((step, i) => {
          const done = completed.has(step.id)
          return (
            <div key={step.id} className={`bg-white rounded-xl border p-5 transition-all ${done?'border-green-100 opacity-75':'border-gray-100'}`}>
              <div className="flex items-start gap-4">
                <button onClick={()=>toggle(step.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all text-sm ${done?'bg-green-500 text-white':'border-2 border-gray-200 text-gray-400 hover:border-brand-300'}`}>
                  {done ? '✓' : i+1}
                </button>
                <div className="flex-1">
                  <p className={`text-sm font-semibold mb-1 ${done?'text-gray-400 line-through':'text-gray-900'}`}>{step.label}</p>
                  <p className="text-xs text-gray-500 mb-3">{step.detail}</p>
                  <code className="text-xs bg-gray-50 text-gray-700 px-3 py-2 rounded-lg block font-mono">{step.command}</code>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-brand-50 rounded-xl p-5 border border-brand-100">
        <p className="text-sm font-semibold text-brand-800 mb-1">🎉 หลัง onboard เสร็จ</p>
        <p className="text-sm text-brand-700">รัน <code className="bg-brand-100 px-1 rounded">/onboard</code> ใน Claude Code เพื่อดู context ทั้งหมดของ project ที่รับผิดชอบ และถาม <code className="bg-brand-100 px-1 rounded">@org-advisor</code> ถ้าไม่แน่ใจ policy ใด</p>
      </div>
    </div>
  )
}
