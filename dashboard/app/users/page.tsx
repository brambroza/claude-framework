'use client'
import { useState, useEffect, useCallback } from 'react'

interface UserRow {
  id: string; email: string; name: string; role: string
  member_id: string | null; is_active: boolean
  last_login: string | null; created_at: string
}

interface MemberRow { id: string; name: string; avatar: string; color: string; role: string }

type UserForm = {
  email: string; name: string; role: string
  password: string; member_id: string; is_active: boolean
}

const EMPTY_FORM: UserForm = {
  email: '', name: '', role: 'viewer', password: '', member_id: '', is_active: true,
}

const ROLES = ['admin', 'editor', 'viewer'] as const
const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-50 text-red-700',
  editor: 'bg-brand-50 text-brand-700',
  viewer: 'bg-gray-100 text-gray-600',
}
const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin', editor: 'Editor', viewer: 'Viewer',
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-900">{title}</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  )
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300'
const fieldCls = 'block text-xs font-medium text-gray-500 mb-1'

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [members, setMembers] = useState<MemberRow[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; data?: UserRow } | null>(null)
  const [form, setForm] = useState<UserForm>(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetPw, setResetPw] = useState(false)

  const load = useCallback(async () => {
    const [u, m] = await Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/members').then(r => r.json()),
    ])
    setUsers(Array.isArray(u) ? u : [])
    setMembers(Array.isArray(m) ? m : [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openCreate() {
    setForm(EMPTY_FORM); setError(null); setResetPw(false)
    setModal({ mode: 'create' })
  }

  function openEdit(u: UserRow) {
    setForm({ email: u.email, name: u.name, role: u.role, password: '', member_id: u.member_id ?? '', is_active: !!u.is_active })
    setError(null); setResetPw(false)
    setModal({ mode: 'edit', data: u })
  }

  async function save() {
    if (!form.email || !form.name) { setError('กรุณากรอก email และชื่อ'); return }
    if (modal?.mode === 'create' && !form.password) { setError('กรุณาตั้ง password'); return }
    setSaving(true); setError(null)

    try {
      const body: Record<string, unknown> = {
        email: form.email, name: form.name, role: form.role,
        member_id: form.member_id || null, is_active: form.is_active,
      }
      if (modal?.mode === 'create' || resetPw) body.password = form.password

      const url = modal?.mode === 'edit' ? `/api/users/${modal.data!.id}` : '/api/users'
      const method = modal?.mode === 'edit' ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setModal(null)
      await load()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/users/${deleteId}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setDeleteId(null)
      await load()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setDeleting(false)
    }
  }

  const deleteTarget = users.find(u => u.id === deleteId)

  if (loading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-xl font-semibold">จัดการ Users</h1></div>
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white h-16 rounded-xl animate-pulse border border-gray-100" />)}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">จัดการ Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">เฉพาะ Admin เท่านั้นที่เข้าถึงได้</p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 bg-brand-500 text-white text-sm rounded-xl hover:bg-brand-600 transition-colors">
          + เพิ่ม User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card"><p className="text-xs text-gray-400 mb-1">Users ทั้งหมด</p><p className="text-2xl font-semibold">{users.length}</p></div>
        <div className="stat-card"><p className="text-xs text-gray-400 mb-1">Active</p><p className="text-2xl font-semibold text-green-600">{users.filter(u => u.is_active).length}</p></div>
        <div className="stat-card"><p className="text-xs text-gray-400 mb-1">Admin</p><p className="text-2xl font-semibold text-red-500">{users.filter(u => u.role === 'admin').length}</p></div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400">
              <th className="px-4 py-3 text-left font-medium">ชื่อ / Email</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Member</th>
              <th className="px-4 py-3 text-left font-medium">Login ล่าสุด</th>
              <th className="px-4 py-3 text-left font-medium">สถานะ</th>
              <th className="px-4 py-3 text-right font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(u => {
              const linked = members.find(m => m.id === u.member_id)
              return (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${ROLE_COLORS[u.role]}`}>{ROLE_LABEL[u.role]}</span>
                  </td>
                  <td className="px-4 py-3">
                    {linked ? (
                      <div className="flex items-center gap-1.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${linked.color}`}>{linked.avatar}</div>
                        <span className="text-xs text-gray-600">{linked.name}</span>
                      </div>
                    ) : <span className="text-xs text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {u.last_login ? new Date(u.last_login).toLocaleDateString('th-TH') : 'ยังไม่เคย'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => openEdit(u)}
                        className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 text-gray-500 hover:text-brand-600 hover:border-brand-200 transition-colors">
                        แก้ไข
                      </button>
                      <button onClick={() => setDeleteId(u.id)}
                        className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors">
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-12">ยังไม่มี users — เพิ่ม admin คนแรกก่อน</p>
        )}
      </div>

      {/* Role guide */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="section-title">สิทธิ์การใช้งาน</p>
        <div className="space-y-2 text-sm">
          {[
            { role: 'Admin',  color: ROLE_COLORS.admin,  desc: 'เข้าถึงทุกอย่าง รวมจัดการ users, ลบข้อมูล' },
            { role: 'Editor', color: ROLE_COLORS.editor, desc: 'เพิ่ม/แก้ไขข้อมูลได้ทุกส่วน ยกเว้น users' },
            { role: 'Viewer', color: ROLE_COLORS.viewer, desc: 'ดูข้อมูลได้อย่างเดียว ไม่สามารถแก้ไขได้' },
          ].map(r => (
            <div key={r.role} className="flex items-center gap-3">
              <span className={`badge ${r.color} w-16 text-center`}>{r.role}</span>
              <p className="text-gray-600">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <Modal
          title={modal.mode === 'create' ? 'เพิ่ม User ใหม่' : `แก้ไข ${modal.data?.name}`}
          onClose={() => setModal(null)}
        >
          <div className="space-y-3">
            <div>
              <label className={fieldCls}>ชื่อ *</label>
              <input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="สมชาย ใจดี" />
            </div>
            <div>
              <label className={fieldCls}>Email *</label>
              <input type="email" className={inputCls} value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                disabled={modal.mode === 'edit'}
                placeholder="somchai@goalong.com" />
            </div>
            <div>
              <label className={fieldCls}>Role</label>
              <select className={inputCls} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
              </select>
            </div>
            <div>
              <label className={fieldCls}>เชื่อมกับ Member (ไม่บังคับ)</label>
              <select className={inputCls} value={form.member_id} onChange={e => setForm(f => ({ ...f, member_id: e.target.value }))}>
                <option value="">— ไม่เชื่อม —</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
              </select>
            </div>
            <div>
              <label className={fieldCls}>สถานะ</label>
              <select className={inputCls} value={form.is_active ? '1' : '0'}
                onChange={e => setForm(f => ({ ...f, is_active: e.target.value === '1' }))}>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            {modal.mode === 'edit' && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={resetPw} onChange={e => setResetPw(e.target.checked)} className="accent-brand-500" />
                <span className="text-sm text-gray-600">Reset password</span>
              </label>
            )}

            {(modal.mode === 'create' || resetPw) && (
              <div>
                <label className={fieldCls}>Password {modal.mode === 'create' ? '*' : '(ใหม่)'}</label>
                <input type="password" className={inputCls} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="อย่างน้อย 8 ตัวอักษร" minLength={8} />
              </div>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setModal(null)} disabled={saving}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                ยกเลิก
              </button>
              <button onClick={save} disabled={saving}
                className="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50">
                {saving ? 'กำลังบันทึก…' : modal.mode === 'create' ? 'เพิ่ม User' : 'บันทึก'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <p className="text-gray-700 mb-1">ลบ user <span className="font-semibold">{deleteTarget?.name}</span>?</p>
            <p className="text-xs text-gray-400 mb-5">การลบ user จะทำให้ไม่สามารถ login ได้อีก</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteId(null)} disabled={deleting}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50">
                ยกเลิก
              </button>
              <button onClick={confirmDelete} disabled={deleting}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50">
                {deleting ? 'กำลังลบ…' : 'ลบ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
