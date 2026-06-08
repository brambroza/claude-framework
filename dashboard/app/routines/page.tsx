'use client'
import { routines, members } from '@/data/mockData'
import { useState } from 'react'

export default function RoutinesPage() {
  const [copied, setCopied] = useState<string|null>(null)

  function copyPrompt(id: string, prompt: string) {
    navigator.clipboard.writeText(prompt)
    setCopied(id)
    setTimeout(()=>setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Routines</h1>
        <p className="text-sm text-gray-500 mt-0.5">งานที่ทำซ้ำประจำ — copy prompt ไปใช้ใน Claude Code ได้เลย</p>
      </div>

      <div className="space-y-4">
        {routines.map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                  <span className="badge bg-blue-50 text-blue-700">🔄 {r.schedule}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span>ครั้งล่าสุด: {r.lastRun}</span>
                  <span>ครั้งถัดไป: <span className="text-gray-600 font-medium">{r.nextRun}</span></span>
                </div>

                {/* Participants */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-gray-400">ผู้เข้าร่วม:</span>
                  <div className="flex -space-x-2">
                    {r.participants.map(pid => {
                      const m = members.find(m=>m.id===pid)
                      return (
                        <div key={pid} title={m?.name}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white ${m?.color}`}>
                          {m?.avatar}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Prompt */}
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-700 leading-relaxed">
                  {r.prompt}
                </div>
              </div>

              <button onClick={()=>copyPrompt(r.id, r.prompt)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${copied===r.id?'bg-green-50 text-green-700':'bg-brand-50 text-brand-600 hover:bg-brand-100'}`}>
                {copied===r.id ? '✓ Copied!' : 'Copy Prompt'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-50 rounded-xl p-5 border border-brand-100">
        <p className="text-sm font-semibold text-brand-800 mb-1">💡 วิธีใช้ Routines</p>
        <p className="text-sm text-brand-700">กด "Copy Prompt" แล้วเปิด terminal รัน <code className="bg-brand-100 px-1 rounded">claude</code> แล้ว paste ได้เลย — Claude จะรู้ว่ากำลังทำ routine อะไรอยู่</p>
      </div>
    </div>
  )
}
