'use client'
import { useState, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MemberRow {
  id: string; name: string; role: string; avatar: string; color: string
  status: string; current_task: string; client_id: string; client_name: string
}

interface ClientRow {
  id: string; name: string; business: string; phase: string; progress: number
  start_date: string; due_date: string; budget: number; spent: number
  lead_id: string; lead_name: string; lead_avatar: string; lead_color: string
  open_tasks: number; open_issues: number; p1_issues: number
  members: Pick<MemberRow, 'id' | 'name' | 'avatar' | 'color' | 'role'>[]
}

type ModalMode = 'create' | 'edit'

interface ClientForm {
  name: string; business: string; phase: string; progress: number
  start_date: string; due_date: string; budget: number; lead_id: string
  member_ids: string[]
}

interface MemberForm {
  name: string; role: string; avatar: string; color: string; status: string
}

const EMPTY_CLIENT: ClientForm = {
  name: '', business: 'software-house', phase: 'presales', progress: 0,
  start_date: '', due_date: '', budget: 0, lead_id: '', member_ids: [],
}
const EMPTY_MEMBER: MemberForm = {
  name: '', role: '', avatar: '', color: 'bg-gray-100 text-gray-700', status: 'idle',
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PHASE_ORDER = ['presales', 'planning', 'delivery', 'handover', 'support']
const PHASES = ['presales', 'planning', 'delivery', 'handover', 'support'] as const
const BUSINESSES = ['software-house', 'ecommerce', 'enterprise', 'retail', 'logistics']
const ROLES = ['Senior Dev', 'Mid Dev', 'Junior Dev', 'Designer', 'PM', 'QA', 'DevOps', 'BA']
const STATUSES = ['active', 'idle', 'meeting', 'offline'] as const

const MEMBER_COLORS = [
  { label: 'Purple',  value: 'bg-purple-100 text-purple-700' },
  { label: 'Blue',    value: 'bg-blue-100 text-blue-700' },
  { label: 'Pink',    value: 'bg-pink-100 text-pink-700' },
  { label: 'Amber',   value: 'bg-amber-100 text-amber-700' },
  { label: 'Teal',    value: 'bg-teal-100 text-teal-700' },
  { label: 'Green',   value: 'bg-green-100 text-green-700' },
  { label: 'Red',     value: 'bg-red-100 text-red-700' },
  { label: 'Indigo',  value: 'bg-indigo-100 text-indigo-700' },
  { label: 'Gray',    value: 'bg-gray-100 text-gray-700' },
]

const phaseColors: Record<string, string> = {
  presales: 'bg-purple-50 text-purple-700 border-purple-100',
  planning: 'bg-blue-50 text-blue-700 border-blue-100',
  delivery: 'bg-amber-50 text-amber-700 border-amber-100',
  handover: 'bg-teal-50 text-teal-700 border-teal-100',
  support: 'bg-green-50 text-green-700 border-green-100',
}

const statusDot: Record<string, string> = {
  active: 'bg-green-500', meeting: 'bg-amber-400', idle: 'bg-gray-300', offline: 'bg-gray-200',
}
const statusLabel: Record<string, string> = {
  active: 'กำลังทำงาน', meeting: 'ประชุม', idle: 'ว่าง', offline: 'ออฟไลน์',
}

// ─── Modal Components ─────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-900">{title}</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  )
}

function ConfirmModal({ message, onConfirm, onCancel, loading }: {
  message: string; onConfirm: () => void; onCancel: () => void; loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <p className="text-gray-700 mb-5">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} disabled={loading}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            ยกเลิก
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50">
            {loading ? 'กำลังลบ…' : 'ลบ'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Form Helpers ─────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300'
const selectCls = inputCls

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrgPage() {
  const [clients, setClients] = useState<ClientRow[]>([])
  const [members, setMembers] = useState<MemberRow[]>([])
  const [loading, setLoading] = useState(true)

  // Modal state
  const [clientModal, setClientModal] = useState<{ mode: ModalMode; data?: ClientRow } | null>(null)
  const [memberModal, setMemberModal] = useState<{ mode: ModalMode; data?: MemberRow } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'client' | 'member'; id: string; name: string } | null>(null)

  // Form state
  const [clientForm, setClientForm] = useState<ClientForm>(EMPTY_CLIENT)
  const [memberForm, setMemberForm] = useState<MemberForm>(EMPTY_MEMBER)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [c, m] = await Promise.all([
      fetch('/api/clients').then(r => r.json()),
      fetch('/api/members').then(r => r.json()),
    ])
    setClients(Array.isArray(c) ? c : [])
    setMembers(Array.isArray(m) ? m : [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // ── Client Modal ───────────────────────────────────────

  function openCreateClient() {
    setClientForm(EMPTY_CLIENT)
    setError(null)
    setClientModal({ mode: 'create' })
  }

  function openEditClient(c: ClientRow) {
    setClientForm({
      name: c.name, business: c.business, phase: c.phase,
      progress: c.progress, start_date: c.start_date?.slice(0, 10) ?? '',
      due_date: c.due_date?.slice(0, 10) ?? '', budget: c.budget,
      lead_id: c.lead_id ?? '', member_ids: c.members.map(m => m.id),
    })
    setError(null)
    setClientModal({ mode: 'edit', data: c })
  }

  async function saveClient() {
    if (!clientForm.name.trim() || !clientForm.phase) {
      setError('กรุณาระบุชื่อ client และ phase')
      return
    }
    setSaving(true); setError(null)
    try {
      const body = {
        ...clientForm,
        lead_id: clientForm.lead_id || null,
        start_date: clientForm.start_date || null,
        due_date: clientForm.due_date || null,
      }
      const url = clientModal?.mode === 'edit' ? `/api/clients/${clientModal.data!.id}` : '/api/clients'
      const method = clientModal?.mode === 'edit' ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'เกิดข้อผิดพลาด')
      setClientModal(null)
      await load()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Member Modal ───────────────────────────────────────

  function openCreateMember() {
    setMemberForm(EMPTY_MEMBER)
    setError(null)
    setMemberModal({ mode: 'create' })
  }

  function openEditMember(m: MemberRow) {
    setMemberForm({ name: m.name, role: m.role, avatar: m.avatar, color: m.color, status: m.status })
    setError(null)
    setMemberModal({ mode: 'edit', data: m })
  }

  async function saveMember() {
    if (!memberForm.name.trim() || !memberForm.role.trim()) {
      setError('กรุณาระบุชื่อและตำแหน่ง')
      return
    }
    setSaving(true); setError(null)
    try {
      const body = {
        ...memberForm,
        avatar: memberForm.avatar || memberForm.name.slice(0, 2),
      }
      const url = memberModal?.mode === 'edit' ? `/api/members/${memberModal.data!.id}` : '/api/members'
      const method = memberModal?.mode === 'edit' ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'เกิดข้อผิดพลาด')
      setMemberModal(null)
      await load()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const url = `/${deleteTarget.type === 'client' ? 'api/clients' : 'api/members'}/${deleteTarget.id}`
      const res = await fetch(url, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'เกิดข้อผิดพลาด')
      setDeleteTarget(null)
      await load()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setDeleting(false)
    }
  }

  // ── Render ─────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-xl font-semibold">Org</h1></div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl h-32 animate-pulse border border-gray-100" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Org</h1>
        <p className="text-sm text-gray-500 mt-0.5">โครงสร้างองค์กร ทีม และ clients ทั้งหมด</p>
      </div>

      {/* ── Pipeline ─────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="section-title mb-0">Project Pipeline</p>
          <button onClick={openCreateClient}
            className="px-3 py-1.5 bg-brand-500 text-white text-sm rounded-lg hover:bg-brand-600 transition-colors">
            + Client
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {PHASE_ORDER.map(phase => {
            const phaseClients = clients.filter(c => c.phase === phase)
            return (
              <div key={phase} className="flex-shrink-0 w-52">
                <div className="flex items-center justify-between mb-3">
                  <span className={`badge border ${phaseColors[phase]}`}>{phase}</span>
                  <span className="text-xs text-gray-400">{phaseClients.length}</span>
                </div>
                <div className="space-y-2">
                  {phaseClients.map(c => (
                    <div key={c.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 group relative">
                      <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                        <button onClick={() => openEditClient(c)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-500 hover:text-brand-600 text-xs">✎</button>
                        <button onClick={() => setDeleteTarget({ type: 'client', id: c.id, name: c.name })}
                          className="w-6 h-6 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-500 hover:text-red-500 text-xs">✕</button>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1 pr-12">{c.name}</p>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full mb-2">
                        <div className="h-full bg-brand-400 rounded-full" style={{ width: `${c.progress}%` }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{c.progress}%</span>
                        {c.lead_avatar && (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${c.lead_color}`}>
                            {c.lead_avatar}
                          </div>
                        )}
                      </div>
                      {(c.p1_issues > 0) && (
                        <span className="mt-1 inline-block badge bg-red-50 text-red-600">P1 ×{c.p1_issues}</span>
                      )}
                    </div>
                  ))}
                  {phaseClients.length === 0 && (
                    <p className="text-xs text-gray-300 text-center py-4">ไม่มี project</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Team ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="section-title mb-0">ทีม GoAlong</p>
          <button onClick={openCreateMember}
            className="px-3 py-1.5 bg-brand-500 text-white text-sm rounded-lg hover:bg-brand-600 transition-colors">
            + สมาชิก
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {members.map(m => {
            const memberClients = clients.filter(c => c.members.some(cm => cm.id === m.id))
            return (
              <div key={m.id} className="rounded-xl border border-gray-100 p-4 group relative">
                <div className="absolute top-3 right-3 hidden group-hover:flex gap-1">
                  <button onClick={() => openEditMember(m)}
                    className="w-6 h-6 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-500 hover:text-brand-600 text-xs">✎</button>
                  <button onClick={() => setDeleteTarget({ type: 'member', id: m.id, name: m.name })}
                    className="w-6 h-6 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-500 hover:text-red-500 text-xs">✕</button>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${m.color}`}>
                    {m.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[m.status] ?? 'bg-gray-300'}`} />
                  <span className="text-xs text-gray-500">{statusLabel[m.status] ?? m.status}</span>
                </div>
                <p className="text-xs text-gray-400 mb-2 truncate">{m.current_task || '—'}</p>
                <div className="flex gap-1 flex-wrap">
                  {memberClients.map(c => (
                    <span key={c.id} className="badge bg-brand-50 text-brand-600">{c.name}</span>
                  ))}
                  {memberClients.length === 0 && (
                    <span className="badge bg-gray-100 text-gray-400">ว่าง</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Framework Layers (static) ────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="section-title">Framework Layers</p>
        <div className="space-y-2">
          {[
            { layer: 'Core',                  path: '~/.claude/',              desc: 'Agents และ skills ที่ใช้ทุก project',               color: 'bg-gray-100 text-gray-700' },
            { layer: 'Org: GoAlong',           path: 'org/goalong/',            desc: 'Rate card, SLA, SME Thai context, policies',          color: 'bg-pink-50 text-pink-700' },
            { layer: 'Business: Software House', path: 'business/software-house/', desc: 'Phase workflow, agents, skills ทุก phase',            color: 'bg-brand-50 text-brand-700' },
            { layer: 'Client',                 path: 'clients/[client]/',       desc: 'Tech stack, rules, MEMORY.md เฉพาะลูกค้า',            color: 'bg-amber-50 text-amber-700' },
          ].map(l => (
            <div key={l.layer} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
              <span className={`badge ${l.color} flex-shrink-0`}>{l.layer}</span>
              <code className="text-xs text-gray-500 flex-shrink-0">{l.path}</code>
              <p className="text-sm text-gray-600">{l.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ Modals ═══════════════════════════ */}

      {/* Client Modal */}
      {clientModal && (
        <Modal
          title={clientModal.mode === 'create' ? 'เพิ่ม Client ใหม่' : `แก้ไข ${clientModal.data?.name}`}
          onClose={() => setClientModal(null)}
        >
          <div className="space-y-3">
            <Field label="ชื่อ Client *">
              <input className={inputCls} value={clientForm.name}
                onChange={e => setClientForm(f => ({ ...f, name: e.target.value }))} placeholder="เช่น Acme Corp" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="ประเภทธุรกิจ">
                <select className={selectCls} value={clientForm.business}
                  onChange={e => setClientForm(f => ({ ...f, business: e.target.value }))}>
                  {BUSINESSES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Phase *">
                <select className={selectCls} value={clientForm.phase}
                  onChange={e => setClientForm(f => ({ ...f, phase: e.target.value }))}>
                  {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
            </div>
            <Field label={`Progress: ${clientForm.progress}%`}>
              <input type="range" min={0} max={100} value={clientForm.progress}
                onChange={e => setClientForm(f => ({ ...f, progress: +e.target.value }))}
                className="w-full" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="วันเริ่ม">
                <input type="date" className={inputCls} value={clientForm.start_date}
                  onChange={e => setClientForm(f => ({ ...f, start_date: e.target.value }))} />
              </Field>
              <Field label="Deadline">
                <input type="date" className={inputCls} value={clientForm.due_date}
                  onChange={e => setClientForm(f => ({ ...f, due_date: e.target.value }))} />
              </Field>
            </div>
            <Field label="Budget (บาท)">
              <input type="number" className={inputCls} value={clientForm.budget}
                onChange={e => setClientForm(f => ({ ...f, budget: +e.target.value }))} min={0} step={10000} />
            </Field>
            <Field label="Project Lead">
              <select className={selectCls} value={clientForm.lead_id}
                onChange={e => setClientForm(f => ({ ...f, lead_id: e.target.value }))}>
                <option value="">— ไม่มี —</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
              </select>
            </Field>
            <Field label="สมาชิกในทีม">
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                {members.map(m => {
                  const checked = clientForm.member_ids.includes(m.id)
                  return (
                    <label key={m.id} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm transition-colors ${checked ? 'border-brand-300 bg-brand-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <input type="checkbox" checked={checked} className="accent-brand-500"
                        onChange={e => setClientForm(f => ({
                          ...f,
                          member_ids: e.target.checked ? [...f.member_ids, m.id] : f.member_ids.filter(id => id !== m.id)
                        }))} />
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${m.color}`}>{m.avatar}</div>
                      <span className="truncate">{m.name}</span>
                    </label>
                  )
                })}
              </div>
            </Field>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setClientModal(null)} disabled={saving}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                ยกเลิก
              </button>
              <button onClick={saveClient} disabled={saving}
                className="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50">
                {saving ? 'กำลังบันทึก…' : clientModal.mode === 'create' ? 'เพิ่ม Client' : 'บันทึก'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Member Modal */}
      {memberModal && (
        <Modal
          title={memberModal.mode === 'create' ? 'เพิ่มสมาชิกใหม่' : `แก้ไข ${memberModal.data?.name}`}
          onClose={() => setMemberModal(null)}
        >
          <div className="space-y-3">
            <Field label="ชื่อ *">
              <input className={inputCls} value={memberForm.name}
                onChange={e => setMemberForm(f => ({ ...f, name: e.target.value, avatar: e.target.value.slice(0, 2) }))}
                placeholder="เช่น สมชาย" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="ตำแหน่ง *">
                <input className={inputCls} list="roles-list" value={memberForm.role}
                  onChange={e => setMemberForm(f => ({ ...f, role: e.target.value }))}
                  placeholder="เช่น Senior Dev" />
                <datalist id="roles-list">{ROLES.map(r => <option key={r} value={r} />)}</datalist>
              </Field>
              <Field label="Avatar (2 ตัวอักษร)">
                <input className={inputCls} value={memberForm.avatar} maxLength={2}
                  onChange={e => setMemberForm(f => ({ ...f, avatar: e.target.value }))} placeholder="เช่น สม" />
              </Field>
            </div>
            <Field label="สถานะ">
              <select className={selectCls} value={memberForm.status}
                onChange={e => setMemberForm(f => ({ ...f, status: e.target.value }))}>
                {STATUSES.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
              </select>
            </Field>
            <Field label="สีประจำตัว">
              <div className="flex gap-2 flex-wrap">
                {MEMBER_COLORS.map(c => (
                  <button key={c.value} onClick={() => setMemberForm(f => ({ ...f, color: c.value }))}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${c.value} ${memberForm.color === c.value ? 'ring-2 ring-brand-500 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}>
                    {memberForm.avatar || 'ก'}
                  </button>
                ))}
              </div>
            </Field>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setMemberModal(null)} disabled={saving}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                ยกเลิก
              </button>
              <button onClick={saveMember} disabled={saving}
                className="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50">
                {saving ? 'กำลังบันทึก…' : memberModal.mode === 'create' ? 'เพิ่มสมาชิก' : 'บันทึก'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmModal
          message={`ลบ "${deleteTarget.name}" ออกจากระบบ? ข้อมูลที่เกี่ยวข้องจะถูก unlink`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
