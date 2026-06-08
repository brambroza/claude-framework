'use client'
import { useState } from 'react'

const defaultSettings = {
  orgName: 'GoAlong',
  defaultBusiness: 'software-house',
  defaultOrg: 'goalong',
  rateJunior: 500,
  rateMid: 800,
  rateSenior: 1200,
  rateDesigner: 700,
  ratePM: 900,
  rateQA: 500,
  rateDevOps: 1000,
  slaP1Response: 1,
  slaP1Resolve: 24,
  slaP2Response: 4,
  slaP2Resolve: 72,
  slaUptime: 99.5,
  supportHours: 'จ-ศ 09:00-18:00',
  warrantyMonths: 3,
  bufferSME: 20,
  bufferUnclear: 15,
  bufferNewTech: 25,
  margin: 30,
  minProject: 150000,
  minMA: 5000,
  lineNotify: '',
  slackWebhook: '',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings)
  const [saved, setSaved] = useState(false)

  function save() {
    setSaved(true)
    setTimeout(()=>setSaved(false),2500)
  }

  function set(key: keyof typeof defaultSettings, value: string|number) {
    setSettings(prev=>({...prev,[key]:value}))
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">ตั้งค่า framework สำหรับองค์กร</p>
      </div>

      <Section title="🏢 ข้อมูลองค์กร">
        <Field label="ชื่อองค์กร" value={settings.orgName} onChange={v=>set('orgName',v)} />
        <Field label="Default business context" value={settings.defaultBusiness} onChange={v=>set('defaultBusiness',v)} />
        <Field label="Default org context" value={settings.defaultOrg} onChange={v=>set('defaultOrg',v)} />
      </Section>

      <Section title="💰 Rate Card (บาท/ชั่วโมง)">
        <div className="grid grid-cols-2 gap-4">
          <NumberField label="Junior Dev" value={settings.rateJunior} onChange={v=>set('rateJunior',v)} />
          <NumberField label="Mid Dev" value={settings.rateMid} onChange={v=>set('rateMid',v)} />
          <NumberField label="Senior Dev" value={settings.rateSenior} onChange={v=>set('rateSenior',v)} />
          <NumberField label="Designer" value={settings.rateDesigner} onChange={v=>set('rateDesigner',v)} />
          <NumberField label="PM" value={settings.ratePM} onChange={v=>set('ratePM',v)} />
          <NumberField label="QA" value={settings.rateQA} onChange={v=>set('rateQA',v)} />
          <NumberField label="DevOps" value={settings.rateDevOps} onChange={v=>set('rateDevOps',v)} />
          <NumberField label="Margin (%)" value={settings.margin} onChange={v=>set('margin',v)} />
        </div>
      </Section>

      <Section title="📊 Pricing & Buffer (%)">
        <div className="grid grid-cols-2 gap-4">
          <NumberField label="Buffer SME client (%)" value={settings.bufferSME} onChange={v=>set('bufferSME',v)} />
          <NumberField label="Buffer unclear spec (%)" value={settings.bufferUnclear} onChange={v=>set('bufferUnclear',v)} />
          <NumberField label="Buffer new technology (%)" value={settings.bufferNewTech} onChange={v=>set('bufferNewTech',v)} />
          <NumberField label="Minimum project (฿)" value={settings.minProject} onChange={v=>set('minProject',v)} />
          <NumberField label="Minimum MA (฿/เดือน)" value={settings.minMA} onChange={v=>set('minMA',v)} />
          <NumberField label="Warranty (เดือน)" value={settings.warrantyMonths} onChange={v=>set('warrantyMonths',v)} />
        </div>
      </Section>

      <Section title="🚨 SLA">
        <div className="grid grid-cols-2 gap-4">
          <NumberField label="P1 Response (ชั่วโมง)" value={settings.slaP1Response} onChange={v=>set('slaP1Response',v)} />
          <NumberField label="P1 Resolve (ชั่วโมง)" value={settings.slaP1Resolve} onChange={v=>set('slaP1Resolve',v)} />
          <NumberField label="P2 Response (ชั่วโมง)" value={settings.slaP2Response} onChange={v=>set('slaP2Response',v)} />
          <NumberField label="P2 Resolve (ชั่วโมง)" value={settings.slaP2Resolve} onChange={v=>set('slaP2Resolve',v)} />
          <NumberField label="Uptime SLA (%)" value={settings.slaUptime} onChange={v=>set('slaUptime',v)} />
        </div>
        <Field label="Support hours" value={settings.supportHours} onChange={v=>set('supportHours',v)} />
      </Section>

      <Section title="🔔 Notifications">
        <Field label="Line Notify Token" value={settings.lineNotify} onChange={v=>set('lineNotify',v)} placeholder="สำหรับ alert P1 และ deploy" />
        <Field label="Slack Webhook URL" value={settings.slackWebhook} onChange={v=>set('slackWebhook',v)} placeholder="optional" />
      </Section>

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-gray-400">การตั้งค่าจะ sync ไปยัง org/goalong/CLAUDE.md อัตโนมัติ</p>
        <button onClick={save}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${saved?'bg-green-500 text-white':'bg-brand-500 text-white hover:bg-brand-600'}`}>
          {saved ? '✓ บันทึกแล้ว' : 'บันทึก'}
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <p className="text-sm font-semibold text-gray-700 mb-4">{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label:string; value:string; onChange:(v:string)=>void; placeholder?:string }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </div>
  )
}

function NumberField({ label, value, onChange }: { label:string; value:number; onChange:(v:number)=>void }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input type="number" value={value} onChange={e=>onChange(Number(e.target.value))}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </div>
  )
}
