import { Task, Issue, Activity, Agent, Skill, Client, Cost, Goal, Routine, Member } from '@/types'

export const members: Member[] = [
  { id:'m1', name:'อมนาถ', role:'Senior Dev', avatar:'อม', color:'bg-purple-100 text-purple-700', status:'active', currentTask:'POS module — API order', client:'acme-corp' },
  { id:'m2', name:'ภาคภูมิ', role:'Mid Dev', avatar:'ภา', color:'bg-blue-100 text-blue-700', status:'active', currentTask:'Stock UI — dashboard page', client:'acme-corp' },
  { id:'m3', name:'นภา', role:'Designer', avatar:'นภ', color:'bg-pink-100 text-pink-700', status:'active', currentTask:'UX wireframe — PO module', client:'beta-retail' },
  { id:'m4', name:'วรรณ', role:'PM', avatar:'วร', color:'bg-amber-100 text-amber-700', status:'meeting', currentTask:'Sprint review prep', client:'acme-corp' },
  { id:'m5', name:'กิตติ', role:'DevOps', avatar:'กต', color:'bg-teal-100 text-teal-700', status:'idle', currentTask:'—', client:'' },
  { id:'m6', name:'ปิยะ', role:'QA', avatar:'ปย', color:'bg-green-100 text-green-700', status:'active', currentTask:'Test POS checkout flow', client:'acme-corp' },
]

export const clients: Client[] = [
  { id:'acme-corp', name:'Acme Corp', business:'ecommerce', phase:'delivery', progress:65, startDate:'2025-03-01', dueDate:'2025-07-15', budget:850000, spent:420000, lead:'m1', members:['m1','m2','m4','m6'] },
  { id:'beta-retail', name:'Beta Retail', business:'software-house', phase:'planning', progress:25, startDate:'2025-05-15', dueDate:'2025-09-30', budget:500000, spent:85000, lead:'m3', members:['m3','m4'] },
  { id:'gamma-logistics', name:'Gamma Logistics', business:'enterprise', phase:'presales', progress:10, startDate:'2025-06-01', dueDate:'2025-12-31', budget:1200000, spent:12000, lead:'m4', members:['m4'] },
]

export const tasks: Task[] = [
  { id:'t1', title:'สร้าง API order management', client:'acme-corp', assignee:'m1', status:'in-progress', priority:'high', phase:'delivery', due:'2025-06-10', tags:['backend','api'] },
  { id:'t2', title:'UI Stock dashboard', client:'acme-corp', assignee:'m2', status:'in-progress', priority:'high', phase:'delivery', due:'2025-06-10', tags:['frontend'] },
  { id:'t3', title:'Wireframe PO module', client:'beta-retail', assignee:'m3', status:'in-progress', priority:'medium', phase:'planning', due:'2025-06-12', tags:['design','ux'] },
  { id:'t4', title:'Sprint review deck', client:'acme-corp', assignee:'m4', status:'in-progress', priority:'medium', phase:'delivery', due:'2025-06-07', tags:['pm'] },
  { id:'t5', title:'ตั้งค่า CI/CD pipeline', client:'acme-corp', assignee:'m5', status:'todo', priority:'medium', phase:'delivery', due:'2025-06-14', tags:['devops'] },
  { id:'t6', title:'Test checkout flow E2E', client:'acme-corp', assignee:'m6', status:'in-progress', priority:'high', phase:'delivery', due:'2025-06-09', tags:['qa','testing'] },
  { id:'t7', title:'Tech spec POS system', client:'beta-retail', assignee:'m3', status:'done', priority:'high', phase:'planning', due:'2025-06-05', tags:['spec'] },
  { id:'t8', title:'Database schema review', client:'acme-corp', assignee:'m1', status:'done', priority:'high', phase:'delivery', due:'2025-06-03', tags:['backend','db'] },
  { id:'t9', title:'Security audit sprint 3', client:'acme-corp', assignee:'m6', status:'todo', priority:'medium', phase:'delivery', due:'2025-06-18', tags:['security'] },
  { id:'t10', title:'Proposal Gamma Logistics', client:'gamma-logistics', assignee:'m4', status:'todo', priority:'low', phase:'presales', due:'2025-06-20', tags:['sales'] },
]

export const issues: Issue[] = [
  { id:'i1', title:'Export Excel ไม่ทำงานบน Safari', client:'acme-corp', reporter:'ลูกค้า', assignee:'m2', priority:'P2', status:'open', createdAt:'2025-06-05', tags:['bug','frontend'] },
  { id:'i2', title:'Login session หมดเร็วเกินไป (15 นาที)', client:'acme-corp', reporter:'m6', assignee:'m1', priority:'P2', status:'in-progress', createdAt:'2025-06-04', tags:['bug','auth'] },
  { id:'i3', title:'ราคาสินค้าไม่ถูกต้องใน cart เมื่อมี discount', client:'acme-corp', reporter:'m6', assignee:'m1', priority:'P1', status:'in-progress', createdAt:'2025-06-06', tags:['bug','critical'] },
  { id:'i4', title:'PDF ใบเสร็จ font ภาษาไทยแสดงผลผิด', client:'beta-retail', reporter:'m3', assignee:'m2', priority:'P3', status:'open', createdAt:'2025-06-05', tags:['bug','pdf'] },
  { id:'i5', title:'ขอเพิ่ม feature: export รายงานเป็น CSV', client:'acme-corp', reporter:'ลูกค้า', assignee:'m4', priority:'P3', status:'open', createdAt:'2025-06-03', tags:['feature-request'] },
]

export const activities: Activity[] = [
  { id:'a1', member:'m1', action:'push code', detail:'feat(order): add status transition API', client:'acme-corp', time:'09:45', type:'code' },
  { id:'a2', member:'m6', action:'open issue', detail:'P1: ราคาสินค้าไม่ถูกต้องใน cart', client:'acme-corp', time:'09:30', type:'issue' },
  { id:'a3', member:'m2', action:'complete task', detail:'UI Stock dashboard — done', client:'acme-corp', time:'09:15', type:'task' },
  { id:'a4', member:'m4', action:'update task', detail:'Sprint review deck — in progress', client:'acme-corp', time:'09:00', type:'task' },
  { id:'a5', member:'m3', action:'push design', detail:'Wireframe PO v2 uploaded to Figma', client:'beta-retail', time:'08:50', type:'design' },
  { id:'a6', member:'m1', action:'resolve issue', detail:'i2: Login session fix deployed staging', client:'acme-corp', time:'08:30', type:'issue' },
  { id:'a7', member:'m5', action:'deploy', detail:'Staging deploy v0.4.2 — success', client:'acme-corp', time:'08:00', type:'deploy' },
]

export const agents: Agent[] = [
  { id:'ag1', name:'sales-consultant', phase:'presales', description:'Discovery, scope analysis, risk flags', usageCount:12, lastUsed:'2025-06-05', layer:'software-house' },
  { id:'ag2', name:'solution-architect', phase:'planning', description:'Architecture, tech stack, ADR', usageCount:8, lastUsed:'2025-06-04', layer:'software-house' },
  { id:'ag3', name:'project-manager', phase:'planning', description:'Sprint planning, task breakdown', usageCount:15, lastUsed:'2025-06-06', layer:'software-house' },
  { id:'ag4', name:'backend-dev', phase:'delivery', description:'API, DB, security', usageCount:34, lastUsed:'2025-06-06', layer:'software-house' },
  { id:'ag5', name:'frontend-dev', phase:'delivery', description:'UI, UX, mobile-first Thai', usageCount:28, lastUsed:'2025-06-06', layer:'software-house' },
  { id:'ag6', name:'devops', phase:'delivery', description:'CI/CD, infra, monitoring', usageCount:11, lastUsed:'2025-06-05', layer:'software-house' },
  { id:'ag7', name:'dba', phase:'delivery', description:'Schema, query optimization', usageCount:9, lastUsed:'2025-06-04', layer:'software-house' },
  { id:'ag8', name:'security-auditor', phase:'delivery', description:'OWASP, vulnerability scan', usageCount:7, lastUsed:'2025-06-03', layer:'core' },
  { id:'ag9', name:'support-agent', phase:'support', description:'Ticket triage, response templates', usageCount:18, lastUsed:'2025-06-06', layer:'software-house' },
  { id:'ag10', name:'doc-writer', phase:'handover', description:'README, API docs, user manual', usageCount:6, lastUsed:'2025-06-02', layer:'core' },
  { id:'ag11', name:'code-reviewer', phase:'delivery', description:'Code quality, PR review', usageCount:22, lastUsed:'2025-06-06', layer:'core' },
  { id:'ag12', name:'org-advisor', phase:'all', description:'GoAlong policy, rate card, SLA', usageCount:5, lastUsed:'2025-06-01', layer:'org' },
]

export const skills: Skill[] = [
  { id:'sk1', name:'proposal', command:'/proposal', phase:'presales', description:'สร้าง proposal ฉบับเต็ม', usageCount:8, layer:'software-house' },
  { id:'sk2', name:'pricing', command:'/pricing', phase:'presales', description:'คำนวณราคา 3 tier', usageCount:8, layer:'software-house' },
  { id:'sk3', name:'pitch-deck', command:'/pitch-deck', phase:'presales', description:'Slide deck สำหรับ CEO', usageCount:5, layer:'software-house' },
  { id:'sk4', name:'estimate', command:'/estimate', phase:'planning', description:'Breakdown งาน + timeline', usageCount:7, layer:'software-house' },
  { id:'sk5', name:'tech-spec', command:'/tech-spec', phase:'planning', description:'Technical specification', usageCount:7, layer:'software-house' },
  { id:'sk6', name:'project-kickoff', command:'/project-kickoff', phase:'planning', description:'Setup project ใหม่', usageCount:4, layer:'software-house' },
  { id:'sk7', name:'code-review', command:'/code-review', phase:'delivery', description:'Full code review', usageCount:19, layer:'core' },
  { id:'sk8', name:'code-review-pr', command:'/code-review-pr', phase:'delivery', description:'PR review + comments', usageCount:17, layer:'software-house' },
  { id:'sk9', name:'deploy-check', command:'/deploy-check', phase:'delivery', description:'Pre-deploy checklist', usageCount:12, layer:'core' },
  { id:'sk10', name:'git-workflow', command:'/git-workflow', phase:'delivery', description:'Branch, commit, PR guide', usageCount:9, layer:'core' },
  { id:'sk11', name:'go-live-checklist', command:'/go-live-checklist', phase:'handover', description:'Checklist ก่อน go-live', usageCount:3, layer:'software-house' },
  { id:'sk12', name:'handover', command:'/handover', phase:'handover', description:'Handover package ครบชุด', usageCount:3, layer:'software-house' },
  { id:'sk13', name:'user-training', command:'/user-training', phase:'handover', description:'Training materials TH', usageCount:3, layer:'software-house' },
  { id:'sk14', name:'bug-triage', command:'/bug-triage', phase:'support', description:'วิเคราะห์ bug + RCA', usageCount:11, layer:'software-house' },
  { id:'sk15', name:'monthly-report', command:'/monthly-report', phase:'support', description:'MA monthly report', usageCount:4, layer:'software-house' },
  { id:'sk16', name:'onboard', command:'/onboard', phase:'all', description:'Developer onboarding', usageCount:6, layer:'core' },
]

export const costs: Cost[] = [
  { month:'ม.ค.', budget:50000, actual:42000, claudeTokens:8200 },
  { month:'ก.พ.', budget:50000, actual:47000, claudeTokens:9100 },
  { month:'มี.ค.', budget:55000, actual:51000, claudeTokens:11200 },
  { month:'เม.ย.', budget:55000, actual:53000, claudeTokens:12800 },
  { month:'พ.ค.', budget:60000, actual:58000, claudeTokens:14500 },
  { month:'มิ.ย.', budget:60000, actual:34000, claudeTokens:8900 },
]

export const goals: Goal[] = [
  { id:'g1', title:'ส่งมอบ Acme Corp ตรงเวลา', description:'Go-live ภายใน 15 ก.ค. 2568', progress:65, dueDate:'2025-07-15', status:'on-track', owner:'m4' },
  { id:'g2', title:'เปิด Beta Retail phase planning', description:'Confirm spec และ estimate ภายใน มิ.ย.', progress:25, dueDate:'2025-06-30', status:'on-track', owner:'m3' },
  { id:'g3', title:'ปิด deal Gamma Logistics', description:'ส่ง proposal และ close ภายใน ส.ค.', progress:10, dueDate:'2025-08-31', status:'at-risk', owner:'m4' },
  { id:'g4', title:'เพิ่ม test coverage เป็น 80%', description:'ทุก project ใหม่ต้องมี coverage ≥ 80%', progress:55, dueDate:'2025-06-30', status:'on-track', owner:'m6' },
  { id:'g5', title:'Launch framework v4 ภายในทีม', description:'Train ทีมทุกคนให้ใช้ Claude Code ได้', progress:80, dueDate:'2025-06-15', status:'on-track', owner:'m4' },
]

export const routines: Routine[] = [
  { id:'r1', name:'Daily standup', schedule:'ทุกวัน 09:00', participants:['m1','m2','m3','m4','m5','m6'], lastRun:'วันนี้', nextRun:'พรุ่งนี้ 09:00', prompt:'@project-manager สรุป standup: ใครทำอะไรเมื่อวาน วันนี้จะทำอะไร มี blocker ไหม' },
  { id:'r2', name:'Sprint review (ทุก 2 สัปดาห์)', schedule:'ศุกร์ 14:00', participants:['m1','m2','m3','m4','m6'], lastRun:'30 พ.ค.', nextRun:'13 มิ.ย.', prompt:'/estimate + @project-manager สรุป sprint ที่ผ่านมาและ plan sprint หน้า' },
  { id:'r3', name:'MA Monthly Report', schedule:'วันที่ 1 ทุกเดือน', participants:['m4'], lastRun:'1 มิ.ย.', nextRun:'1 ก.ค.', prompt:'/monthly-report เดือน: [เดือน] client: [ชื่อ] uptime: [%]' },
  { id:'r4', name:'Security Audit (ทุก sprint)', schedule:'ทุก 2 สัปดาห์', participants:['m6','m1'], lastRun:'30 พ.ค.', nextRun:'13 มิ.ย.', prompt:'@security-auditor ตรวจ code ที่เพิ่มใน sprint นี้' },
  { id:'r5', name:'Backup & Health Check', schedule:'ทุกวันจันทร์ 08:00', participants:['m5'], lastRun:'3 มิ.ย.', nextRun:'10 มิ.ย.', prompt:'@devops ตรวจ server health, disk usage, backup status ทุก client' },
]
