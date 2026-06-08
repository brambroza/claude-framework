/**
 * seed.ts — ใส่ข้อมูลตัวอย่างเข้า MSSQL
 * รันด้วย: npm run db:seed
 */
import { getPool, sql } from './connection.js'

async function seed() {
  console.log('🌱 Seeding database...')
  const pool = await getPool()

  // ─── Members ─────────────────────────────────────────
  console.log('  → members')
  const members = [
    { id:'m1', name:'อมนาถ', role:'Senior Dev', avatar:'อม', color:'bg-purple-100 text-purple-700', status:'active', current_task:'POS module — API order', client_id:'acme-corp' },
    { id:'m2', name:'ภาคภูมิ', role:'Mid Dev', avatar:'ภา', color:'bg-blue-100 text-blue-700', status:'active', current_task:'Stock UI — dashboard page', client_id:'acme-corp' },
    { id:'m3', name:'นภา', role:'Designer', avatar:'นภ', color:'bg-pink-100 text-pink-700', status:'active', current_task:'UX wireframe — PO module', client_id:'beta-retail' },
    { id:'m4', name:'วรรณ', role:'PM', avatar:'วร', color:'bg-amber-100 text-amber-700', status:'meeting', current_task:'Sprint review prep', client_id:'acme-corp' },
    { id:'m5', name:'กิตติ', role:'DevOps', avatar:'กต', color:'bg-teal-100 text-teal-700', status:'idle', current_task:null, client_id:null },
    { id:'m6', name:'ปิยะ', role:'QA', avatar:'ปย', color:'bg-green-100 text-green-700', status:'active', current_task:'Test POS checkout flow', client_id:'acme-corp' },
  ]
  for (const m of members) {
    await pool.request()
      .input('id', m.id).input('name', m.name).input('role', m.role)
      .input('avatar', m.avatar).input('color', m.color).input('status', m.status)
      .input('current_task', m.current_task).input('client_id', m.client_id)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM members WHERE id=@id)
        INSERT INTO members (id,name,role,avatar,color,status,current_task,client_id)
        VALUES (@id,@name,@role,@avatar,@color,@status,@current_task,@client_id)
      `)
  }

  // ─── Clients ─────────────────────────────────────────
  console.log('  → clients')
  const clients = [
    { id:'acme-corp', name:'Acme Corp', business:'ecommerce', phase:'delivery', progress:65, start_date:'2025-03-01', due_date:'2025-07-15', budget:850000, spent:420000, lead_id:'m1' },
    { id:'beta-retail', name:'Beta Retail', business:'software-house', phase:'planning', progress:25, start_date:'2025-05-15', due_date:'2025-09-30', budget:500000, spent:85000, lead_id:'m3' },
    { id:'gamma-logistics', name:'Gamma Logistics', business:'enterprise', phase:'presales', progress:10, start_date:'2025-06-01', due_date:'2025-12-31', budget:1200000, spent:12000, lead_id:'m4' },
  ]
  for (const c of clients) {
    await pool.request()
      .input('id', c.id).input('name', c.name).input('business', c.business)
      .input('phase', c.phase).input('progress', c.progress)
      .input('start_date', c.start_date).input('due_date', c.due_date)
      .input('budget', c.budget).input('spent', c.spent).input('lead_id', c.lead_id)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM clients WHERE id=@id)
        INSERT INTO clients (id,name,business,phase,progress,start_date,due_date,budget,spent,lead_id)
        VALUES (@id,@name,@business,@phase,@progress,@start_date,@due_date,@budget,@spent,@lead_id)
      `)
  }

  // ─── Client Members ───────────────────────────────────
  const cm = [
    ['acme-corp','m1'],['acme-corp','m2'],['acme-corp','m4'],['acme-corp','m6'],
    ['beta-retail','m3'],['beta-retail','m4'],
    ['gamma-logistics','m4'],
  ]
  for (const [cid,mid] of cm) {
    await pool.request().input('cid',cid).input('mid',mid).query(`
      IF NOT EXISTS (SELECT 1 FROM client_members WHERE client_id=@cid AND member_id=@mid)
      INSERT INTO client_members (client_id,member_id) VALUES (@cid,@mid)
    `)
  }

  // ─── Tasks ───────────────────────────────────────────
  console.log('  → tasks')
  const tasks = [
    { id:'t1', title:'สร้าง API order management', client_id:'acme-corp', assignee_id:'m1', status:'in-progress', priority:'high', phase:'delivery', due_date:'2025-06-10', tags:'backend,api' },
    { id:'t2', title:'UI Stock dashboard', client_id:'acme-corp', assignee_id:'m2', status:'in-progress', priority:'high', phase:'delivery', due_date:'2025-06-10', tags:'frontend' },
    { id:'t3', title:'Wireframe PO module', client_id:'beta-retail', assignee_id:'m3', status:'in-progress', priority:'medium', phase:'planning', due_date:'2025-06-12', tags:'design,ux' },
    { id:'t4', title:'Sprint review deck', client_id:'acme-corp', assignee_id:'m4', status:'in-progress', priority:'medium', phase:'delivery', due_date:'2025-06-07', tags:'pm' },
    { id:'t5', title:'ตั้งค่า CI/CD pipeline', client_id:'acme-corp', assignee_id:'m5', status:'todo', priority:'medium', phase:'delivery', due_date:'2025-06-14', tags:'devops' },
    { id:'t6', title:'Test checkout flow E2E', client_id:'acme-corp', assignee_id:'m6', status:'in-progress', priority:'high', phase:'delivery', due_date:'2025-06-09', tags:'qa,testing' },
    { id:'t7', title:'Tech spec POS system', client_id:'beta-retail', assignee_id:'m3', status:'done', priority:'high', phase:'planning', due_date:'2025-06-05', tags:'spec' },
    { id:'t8', title:'Database schema review', client_id:'acme-corp', assignee_id:'m1', status:'done', priority:'high', phase:'delivery', due_date:'2025-06-03', tags:'backend,db' },
  ]
  for (const t of tasks) {
    await pool.request()
      .input('id',t.id).input('title',t.title).input('client_id',t.client_id)
      .input('assignee_id',t.assignee_id).input('status',t.status).input('priority',t.priority)
      .input('phase',t.phase).input('due_date',t.due_date).input('tags',t.tags)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM tasks WHERE id=@id)
        INSERT INTO tasks (id,title,client_id,assignee_id,status,priority,phase,due_date,tags)
        VALUES (@id,@title,@client_id,@assignee_id,@status,@priority,@phase,@due_date,@tags)
      `)
  }

  // ─── Issues ──────────────────────────────────────────
  console.log('  → issues')
  const issues = [
    { id:'i1', title:'Export Excel ไม่ทำงานบน Safari', client_id:'acme-corp', reporter:'ลูกค้า', assignee_id:'m2', priority:'P2', status:'open', tags:'bug,frontend' },
    { id:'i2', title:'Login session หมดเร็วเกินไป (15 นาที)', client_id:'acme-corp', reporter:'m6', assignee_id:'m1', priority:'P2', status:'in-progress', tags:'bug,auth' },
    { id:'i3', title:'ราคาสินค้าไม่ถูกต้องใน cart เมื่อมี discount', client_id:'acme-corp', reporter:'m6', assignee_id:'m1', priority:'P1', status:'in-progress', tags:'bug,critical' },
    { id:'i4', title:'PDF ใบเสร็จ font ภาษาไทยแสดงผลผิด', client_id:'beta-retail', reporter:'m3', assignee_id:'m2', priority:'P3', status:'open', tags:'bug,pdf' },
    { id:'i5', title:'ขอเพิ่ม feature: export รายงานเป็น CSV', client_id:'acme-corp', reporter:'ลูกค้า', assignee_id:'m4', priority:'P3', status:'open', tags:'feature-request' },
  ]
  for (const i of issues) {
    await pool.request()
      .input('id',i.id).input('title',i.title).input('client_id',i.client_id)
      .input('reporter',i.reporter).input('assignee_id',i.assignee_id)
      .input('priority',i.priority).input('status',i.status).input('tags',i.tags)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM issues WHERE id=@id)
        INSERT INTO issues (id,title,client_id,reporter,assignee_id,priority,status,tags)
        VALUES (@id,@title,@client_id,@reporter,@assignee_id,@priority,@status,@tags)
      `)
  }

  // ─── Activity Log ─────────────────────────────────────
  console.log('  → activity_log')
  const activities = [
    { member_id:'m1', action:'push code', detail:'feat(order): add status transition API', client_id:'acme-corp', type:'code' },
    { member_id:'m6', action:'open issue', detail:'P1: ราคาสินค้าไม่ถูกต้องใน cart', client_id:'acme-corp', type:'issue' },
    { member_id:'m2', action:'complete task', detail:'UI Stock dashboard — done', client_id:'acme-corp', type:'task' },
    { member_id:'m5', action:'deploy', detail:'Staging deploy v0.4.2 — success', client_id:'acme-corp', type:'deploy' },
    { member_id:'m3', action:'push design', detail:'Wireframe PO v2 uploaded to Figma', client_id:'beta-retail', type:'design' },
  ]
  for (const a of activities) {
    await pool.request()
      .input('member_id',a.member_id).input('action',a.action).input('detail',a.detail)
      .input('client_id',a.client_id).input('type',a.type)
      .query(`INSERT INTO activity_log (member_id,action,detail,client_id,type) VALUES (@member_id,@action,@detail,@client_id,@type)`)
  }

  // ─── Goals ───────────────────────────────────────────
  console.log('  → goals')
  const goals = [
    { id:'g1', title:'ส่งมอบ Acme Corp ตรงเวลา', description:'Go-live ภายใน 15 ก.ค. 2568', progress:65, due_date:'2025-07-15', status:'on-track', owner_id:'m4' },
    { id:'g2', title:'เปิด Beta Retail phase planning', description:'Confirm spec และ estimate ภายใน มิ.ย.', progress:25, due_date:'2025-06-30', status:'on-track', owner_id:'m3' },
    { id:'g3', title:'ปิด deal Gamma Logistics', description:'ส่ง proposal และ close ภายใน ส.ค.', progress:10, due_date:'2025-08-31', status:'at-risk', owner_id:'m4' },
    { id:'g4', title:'เพิ่ม test coverage เป็น 80%', description:'ทุก project ใหม่ต้องมี coverage ≥ 80%', progress:55, due_date:'2025-06-30', status:'on-track', owner_id:'m6' },
    { id:'g5', title:'Launch framework v4 ภายในทีม', description:'Train ทีมทุกคนให้ใช้ Claude Code ได้', progress:80, due_date:'2025-06-15', status:'on-track', owner_id:'m4' },
  ]
  for (const g of goals) {
    await pool.request()
      .input('id',g.id).input('title',g.title).input('description',g.description)
      .input('progress',g.progress).input('due_date',g.due_date)
      .input('status',g.status).input('owner_id',g.owner_id)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM goals WHERE id=@id)
        INSERT INTO goals (id,title,description,progress,due_date,status,owner_id)
        VALUES (@id,@title,@description,@progress,@due_date,@status,@owner_id)
      `)
  }

  // ─── Monthly Costs ────────────────────────────────────
  console.log('  → monthly_costs')
  const costs = [
    { ym:'2025-01', label:'ม.ค.', budget:50000, actual:42000, tokens:8200 },
    { ym:'2025-02', label:'ก.พ.', budget:50000, actual:47000, tokens:9100 },
    { ym:'2025-03', label:'มี.ค.', budget:55000, actual:51000, tokens:11200 },
    { ym:'2025-04', label:'เม.ย.', budget:55000, actual:53000, tokens:12800 },
    { ym:'2025-05', label:'พ.ค.', budget:60000, actual:58000, tokens:14500 },
    { ym:'2025-06', label:'มิ.ย.', budget:60000, actual:34000, tokens:8900 },
  ]
  for (const c of costs) {
    await pool.request()
      .input('ym',c.ym).input('label',c.label).input('budget',c.budget)
      .input('actual',c.actual).input('tokens',c.tokens)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM monthly_costs WHERE year_month=@ym)
        INSERT INTO monthly_costs (year_month,display_label,budget,actual,claude_tokens)
        VALUES (@ym,@label,@budget,@actual,@tokens)
      `)
  }

  // ─── Routines ─────────────────────────────────────────
  console.log('  → routines')
  const routines = [
    { id:'r1', name:'Daily standup', schedule:'ทุกวัน 09:00', prompt:'@project-manager สรุป standup: ใครทำอะไรเมื่อวาน วันนี้จะทำอะไร มี blocker ไหม', last_run:'วันนี้', next_run:'พรุ่งนี้ 09:00' },
    { id:'r2', name:'Sprint review (ทุก 2 สัปดาห์)', schedule:'ศุกร์ 14:00', prompt:'/estimate + @project-manager สรุป sprint ที่ผ่านมาและ plan sprint หน้า', last_run:'30 พ.ค.', next_run:'13 มิ.ย.' },
    { id:'r3', name:'MA Monthly Report', schedule:'วันที่ 1 ทุกเดือน', prompt:'/monthly-report เดือน: [เดือน] client: [ชื่อ] uptime: [%]', last_run:'1 มิ.ย.', next_run:'1 ก.ค.' },
    { id:'r4', name:'Security Audit (ทุก sprint)', schedule:'ทุก 2 สัปดาห์', prompt:'@security-auditor ตรวจ code ที่เพิ่มใน sprint นี้', last_run:'30 พ.ค.', next_run:'13 มิ.ย.' },
    { id:'r5', name:'Backup & Health Check', schedule:'ทุกวันจันทร์ 08:00', prompt:'@devops ตรวจ server health, disk usage, backup status ทุก client', last_run:'3 มิ.ย.', next_run:'10 มิ.ย.' },
  ]
  for (const r of routines) {
    await pool.request()
      .input('id',r.id).input('name',r.name).input('schedule',r.schedule)
      .input('prompt',r.prompt).input('last_run',r.last_run).input('next_run',r.next_run)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM routines WHERE id=@id)
        INSERT INTO routines (id,name,schedule,prompt_template,last_run,next_run)
        VALUES (@id,@name,@schedule,@prompt,@last_run,@next_run)
      `)
  }

  // ─── Default Admin User ──────────────────────────────
  console.log('  → admin user')
  const { hashSync } = await import('bcryptjs')
  const adminHash = hashSync('admin1234', 12)
  await pool.request()
    .input('email', 'admin@goalong.com')
    .input('name', 'Admin')
    .input('hash', adminHash)
    .query(`
      IF NOT EXISTS (SELECT 1 FROM users WHERE email='admin@goalong.com')
      INSERT INTO users (email, name, password_hash, role)
      VALUES (@email, @name, @hash, 'admin')
    `)

  console.log('\n✅ Seed complete!')
  console.log('   Admin login: admin@goalong.com / admin1234')
  console.log('   เปิด dashboard: npm run dev')
  process.exit(0)
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1) })
