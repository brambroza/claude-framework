# Claude Code Framework — คู่มือการใช้งาน

> GoAlong Software House | Framework v4.0  
> อัพเดตล่าสุด: มิถุนายน 2569

---

## สารบัญ

1. [Framework คืออะไร](#1-framework-คืออะไร)
2. [โครงสร้าง 4 Layer](#2-โครงสร้าง-4-layer)
3. [Agent คืออะไร และทำงานอย่างไร](#3-agent-คืออะไร-และทำงานอย่างไร)
4. [Skill คืออะไร และทำงานอย่างไร](#4-skill-คืออะไร-และทำงานอย่างไร)
5. [Agent vs Skill — ความแตกต่าง](#5-agent-vs-skill--ความแตกต่าง)
6. [รายการ Agents ทั้งหมด](#6-รายการ-agents-ทั้งหมด)
7. [รายการ Skills ทั้งหมด](#7-รายการ-skills-ทั้งหมด)
8. [Workflow ตาม Phase](#8-workflow-ตาม-phase)
9. [ตัวอย่างการใช้งานจริง](#9-ตัวอย่างการใช้งานจริง)
10. [Memory System](#10-memory-system)
11. [Tips & Best Practices](#11-tips--best-practices)

---

## 1. Framework คืออะไร

Claude Code Framework คือชุด **context** และ **instruction** ที่บอก Claude ว่า:
- เราเป็นใคร (GoAlong Software House)
- ลูกค้าคือใคร (client layer)
- งานแบบไหนต้องใช้อะไร (agents + skills)
- ห้ามทำอะไรโดยเด็ดขาด (forbidden actions)

**ประโยชน์หลัก:**
- Claude ตอบตรง context งานจริง ไม่ต้อง brief ซ้ำทุกครั้ง
- มีมาตรฐาน output ที่สอดคล้องกันทั้งทีม
- Context ข้ามเซสชันได้ผ่าน Memory system
- ป้องกัน action อันตราย (ลบไฟล์, force push, drop table)

---

## 2. โครงสร้าง 4 Layer

Framework ทำงานแบบ **layered inheritance** — layer ด้านล่างรับค่าจาก layer ด้านบน และ override ได้

```
┌─────────────────────────────────────────────────────┐
│  CORE LAYER  (~/.claude/CLAUDE.md)                  │
│  ใช้กับทุก project ทุก business                       │
│  → language rules, coding standards, git, security  │
├─────────────────────────────────────────────────────┤
│  ORG LAYER  (org/goalong/CLAUDE.md)                 │
│  ใช้กับทุก project ในองค์กร GoAlong                   │
│  → rate card, SLA, SME Thai context, policies       │
├─────────────────────────────────────────────────────┤
│  BUSINESS LAYER  (business/software-house/CLAUDE.md)│
│  ใช้กับ project ประเภท software house                 │
│  → phase workflow, agents per phase, delivery std   │
├─────────────────────────────────────────────────────┤
│  CLIENT LAYER  (clients/[client-id]/CLAUDE.md)      │
│  ใช้เฉพาะลูกค้านี้                                     │
│  → tech stack เฉพาะ, rules พิเศษ, contacts           │
└─────────────────────────────────────────────────────┘
```

### วิธี Override Section

Layer ด้านล่างสามารถเขียนทับ section จาก layer ด้านบนได้:

```markdown
## [SECTION: coding-standards][OVERRIDE]
# ใช้ JavaScript ไม่ใช่ TypeScript (client request)
- ห้ามใช้ TypeScript
- ใช้ ES2022+
```

---

## 3. Agent คืออะไร และทำงานอย่างไร

### นิยาม

**Agent** คือ Claude instance ที่มี **บุคลิกและความเชี่ยวชาญเฉพาะด้าน** ฝังอยู่ใน system prompt  
เวลาเรียก `@agent-name` Claude จะ "เป็น" expert คนนั้น มีมุมมองและ output style ที่ชัดเจน

### โครงสร้างไฟล์ Agent

ไฟล์ agent เก็บอยู่ที่ `~/.claude/agents/[name].md`

```markdown
---
name: backend-dev
description: ช่วยงาน backend development — API design, database, performance, security
allowed-tools:
  - Read
  - Write
  - Bash
model: sonnet          # optional: ถ้าไม่ระบุ = inherit จาก Claude Code
memory: user           # optional: user | project
---

# เนื้อหา system prompt ของ agent
## ความเชี่ยวชาญ
...
```

**Frontmatter fields:**

| Field | ความหมาย | ค่าที่เป็นไปได้ |
|---|---|---|
| `name` | ชื่อที่ใช้เรียก `@name` | string |
| `description` | บอก Claude Code ว่า agent นี้ทำอะไร | string |
| `allowed-tools` | tools ที่ agent ใช้ได้ | Read, Write, Bash, WebSearch, ... |
| `model` | model ที่ใช้ | inherit, sonnet, opus, haiku |
| `memory` | scope ของ memory | user, project |

### วิธีเรียก Agent

```
@[agent-name] [บอก context และงานที่ต้องการ]
```

**ตัวอย่าง:**

```
@backend-dev ออกแบบ REST API สำหรับระบบ POS 
รับออเดอร์ + คำนวณราคา + ลด stock อัตโนมัติ
ใช้ Node.js + PostgreSQL ตาม tech stack ที่ตกลงไว้
```

```
@solution-architect 
ลูกค้า: ร้านสะดวกซื้อ SME
งบ server: 3,000 บาท/เดือน
ต้องการ: POS + Stock + บัญชีเบื้องต้น
เสนอ architecture และ tech stack ที่เหมาะสม
```

### Agent ทำงานอย่างไร (กลไก)

```
User พิมพ์ @backend-dev [งาน]
         ↓
Claude Code โหลด ~/.claude/agents/backend-dev.md
         ↓
เนื้อหาใน .md กลายเป็น system prompt ของ sub-agent
         ↓
Sub-agent ทำงานด้วย tools ที่ allowed
         ↓
ส่งผลลัพธ์กลับมาใน conversation หลัก
```

### Model Override

Agent บางตัวระบุ model เฉพาะ เช่น `model: sonnet` หมายถึง agent นั้น
จะใช้ Claude Sonnet เสมอ ไม่ว่า Claude Code จะใช้ model อะไรอยู่ก็ตาม

```
agent ที่มี model: sonnet → ใช้ claude-sonnet-4-6
agent ที่ไม่ระบุ (inherit) → ใช้ model เดียวกับ session ปัจจุบัน
```

---

## 4. Skill คืออะไร และทำงานอย่างไร

### นิยาม

**Skill** คือ **workflow อัตโนมัติ** ที่ Claude ทำตามขั้นตอนที่กำหนดไว้  
ไม่ใช่ "บุคลิก" แต่เป็น "กระบวนการ" — เรียกด้วย `/skill-name`

Skill เหมาะกับงานที่มีขั้นตอนชัดเจน ทำซ้ำบ่อย และต้องการ output format มาตรฐาน

### โครงสร้างไฟล์ Skill

ไฟล์ skill เก็บอยู่ที่ `~/.claude/skills/[name]/SKILL.md`

```markdown
---
name: proposal
description: สร้าง proposal ฉบับเต็มสำหรับ SME ไทย
allowed-tools:
  - Read
  - Write
context: fork           # fork = รัน sub-context แยก
---

# Proposal Skill

## ขั้นตอน

1. รับ input: ชื่อลูกค้า, scope, งบ, timeline
2. วิเคราะห์ requirement
3. เขียน proposal ตาม template มาตรฐาน
...
```

### วิธีเรียก Skill

```
/[skill-name] [arguments ถ้าต้องการ]
```

**ตัวอย่าง:**

```
/proposal
ลูกค้า: บริษัท ABC จำกัด
ธุรกิจ: ร้านอาหาร 5 สาขา
งาน: ระบบ POS + จัดการวัตถุดิบ + รายงาน
งบ: 300,000 บาท
timeline: 4 เดือน
```

```
/estimate
feature: ระบบ authentication + user management
ทีม: senior 1 คน, mid 1 คน
```

```
/code-review
```
*(รัน review บน diff ปัจจุบัน)*

### Skill ทำงานอย่างไร (กลไก)

```
User พิมพ์ /proposal [ข้อมูลลูกค้า]
         ↓
Claude Code โหลด ~/.claude/skills/proposal/SKILL.md
         ↓
เนื้อหาใน SKILL.md กลายเป็น instruction ของ task
         ↓
Claude รัน workflow ตามขั้นตอนใน SKILL.md
         ↓
ส่ง output ตาม format ที่ skill กำหนด
```

---

## 5. Agent vs Skill — ความแตกต่าง

| | Agent | Skill |
|---|---|---|
| เรียกด้วย | `@agent-name` | `/skill-name` |
| คือ | บุคลิก / expert ด้านนั้น | workflow / กระบวนการ |
| เหมาะกับ | งานที่ต้องการ expertise ต่อเนื่อง | งานที่มีขั้นตอนชัดเจน |
| Context | ยาว — ฝัง domain knowledge | สั้น — ระบุ steps ที่ต้องทำ |
| Output | ยืดหยุ่น ตาม judgment ของ agent | มาตรฐาน ตาม template |
| ตัวอย่าง | @backend-dev ช่วย debug API | /proposal สร้าง proposal |

### เมื่อใช้อะไร?

```
ต้องการ expertise หรือคำปรึกษา → Agent
  "ช่วยดูว่า architecture นี้มีปัญหาไหม"
  → @solution-architect

ต้องการ output มาตรฐาน → Skill
  "สร้าง proposal ส่งลูกค้าพรุ่งนี้"
  → /proposal
```

### ใช้ร่วมกัน

Agent และ skill ทำงานร่วมกันได้ใน workflow เดียวกัน:

```
@solution-architect วิเคราะห์ architecture
    ↓ ได้ ADR และ tech stack
/tech-spec สร้าง spec จาก architecture ด้านบน
    ↓ ได้ technical specification
@backend-dev เริ่ม implement ตาม spec
    ↓
/code-review ตรวจ code ก่อน PR
```

---

## 6. รายการ Agents ทั้งหมด

### Phase: Presales

| Agent | เรียกด้วย | ทำอะไร | ใช้เมื่อ |
|---|---|---|---|
| Sales Consultant | `@sales-consultant` | Discovery session, วิเคราะห์ scope, เตรียมเจรจา | คุยกับลูกค้าใหม่ครั้งแรก |
| Product Brand Strategist | `@product-brand-strategist` | วิเคราะห์ product strategy, brand positioning | เริ่มวางแผน product ใหม่ |
| Software Sales & Marketing | `@software-sales-marketing-advisor` | Marketing strategy, pitch deck, go-to-market | เตรียม present ให้นักลงทุนหรือลูกค้าใหญ่ |

### Phase: Planning

| Agent | เรียกด้วย | ทำอะไร | ใช้เมื่อ |
|---|---|---|---|
| Solution Architect | `@solution-architect` | Architecture design, tech stack, ADR | เริ่มออกแบบระบบ |
| Tech Architect | `@tech-architect` | Technical decision, stack evaluation | ต้องการ review ทางเทคนิค |
| Project Manager | `@project-manager` | Sprint planning, task breakdown, tracking | วางแผน sprint หรือ breakdown งาน |

### Phase: Delivery

| Agent | เรียกด้วย | ทำอะไร | ใช้เมื่อ |
|---|---|---|---|
| Backend Dev | `@backend-dev` | API design, database, security, performance | เขียน server-side code |
| Frontend Dev | `@frontend-dev` | UI/UX, mobile-first, Thai context | เขียน client-side code |
| Frontend MUI Expert | `@frontend-mui-expert` | MUI, React, Next.js, Flutter | งาน UI ที่ใช้ MUI หรือ Flutter |
| Senior Backend Architect | `@senior-backend-architect` | Advanced architecture, security hardening | ระบบ scale ใหญ่หรือ security critical |
| DBA | `@dba` | Schema design, query optimization, migration | ปัญหา database performance หรือ design |
| DevOps | `@devops` | CI/CD, infrastructure, monitoring | setup server หรือ deployment pipeline |
| Code Reviewer | `@code-reviewer` | Code quality, security, best practices | review code ก่อน merge |
| Security Auditor | `@security-auditor` | OWASP scan, vulnerability assessment | ก่อน release หรือสงสัยด้าน security |
| Software Tester | `@software-tester-reporter` | Test plan, test execution, report | ทดสอบ feature ใหม่หรือก่อน release |

### Phase: Handover

| Agent | เรียกด้วย | ทำอะไร | ใช้เมื่อ |
|---|---|---|---|
| Doc Writer | `@doc-writer` | README, API docs, user manual (TH/EN) | ก่อน handover หรือต้องการ documentation |

### Phase: Support (MA)

| Agent | เรียกด้วย | ทำอะไร | ใช้เมื่อ |
|---|---|---|---|
| Support Agent | `@support-agent` | Ticket triage, how-to, escalation | รับ support ticket จากลูกค้า |

### ข้ามทุก Phase

| Agent | เรียกด้วย | ทำอะไร | ใช้เมื่อ |
|---|---|---|---|
| Org Advisor | `@org-advisor` | GoAlong policy, rate card, SLA, process | ไม่แน่ใจ policy ขององค์กร |
| Software CEO Strategist | `@software-ceo-strategist` | Market analysis, strategic planning | ตัดสินใจระดับ company/product |

---

## 7. รายการ Skills ทั้งหมด

### Phase: Presales

| Skill | Command | Output | ใช้เมื่อ |
|---|---|---|---|
| Proposal | `/proposal` | Proposal ฉบับเต็ม (executive summary → technical → pricing) | เตรียม proposal ส่งลูกค้า |
| Pricing | `/pricing` | ราคา 3 tier พร้อม breakdown | คำนวณราคาหลัง scope confirm |
| Pitch Deck | `/pitch-deck` | Outline slide deck สำหรับ CEO/MD | เตรียม present ลูกค้า |

### Phase: Planning

| Skill | Command | Output | ใช้เมื่อ |
|---|---|---|---|
| Estimate | `/estimate` | Task breakdown + ชั่วโมง + timeline | ก่อนเซ็นสัญญา หรือวาง sprint |
| Tech Spec | `/tech-spec` | Technical specification ครบชุด | ก่อนเริ่ม develop feature |
| Project Kickoff | `/project-kickoff` | Project structure + boilerplate setup | เริ่ม project ใหม่ |

### Phase: Delivery

| Skill | Command | Output | ใช้เมื่อ |
|---|---|---|---|
| Code Review | `/code-review` | Review report: bugs, security, performance | ต้องการ review diff/PR |
| Code Review PR | `/code-review-pr` | Review + inline PR comments | ก่อน merge PR สำคัญ |
| Deploy Check | `/deploy-check` | Pre-deploy checklist | ก่อน deploy ทุกครั้ง |
| Git Workflow | `/git-workflow` | Guide: branch, commit, PR, merge | ไม่แน่ใจ git convention |

### Phase: Handover

| Skill | Command | Output | ใช้เมื่อ |
|---|---|---|---|
| Go-Live Checklist | `/go-live-checklist` | Checklist ครอบคลุมทุกด้านก่อน go-live | 1–2 วันก่อน production |
| Handover | `/handover` | Handover package ครบชุด | เตรียมส่งมอบ project |
| User Training | `/user-training` | Training materials + agenda ภาษาไทย | ก่อน go-live, ก่อน handover |

### Phase: Support (MA)

| Skill | Command | Output | ใช้เมื่อ |
|---|---|---|---|
| Bug Triage | `/bug-triage` | วิเคราะห์ bug ตั้งแต่รับแจ้งถึง resolve | รับ bug report จากลูกค้า |
| Monthly Report | `/monthly-report` | MA monthly report ครบชุด | ทุกต้นเดือนสำหรับ MA client |

### ข้ามทุก Phase

| Skill | Command | Output | ใช้เมื่อ |
|---|---|---|---|
| Onboard | `/onboard` | แนะนำ project setup, workflow ทั้งหมด | developer ใหม่เข้า project |

---

## 8. Workflow ตาม Phase

### Phase 1: Presales — ปิด Deal

```
ลูกค้าติดต่อมา
    ↓
@sales-consultant Discovery session
    → ถามคำถาม 5 ข้อ, ระบุ scope, ประเมิน risk
    ↓
/pitch-deck สร้าง slide outline ก่อน meeting
    ↓
/pricing คำนวณราคา 3 tier
    ↓
/proposal สร้าง proposal ฉบับเต็ม
    ↓
เซ็นสัญญา ✓
```

### Phase 2: Planning — วางแผน

```
ได้รับ scope แล้ว
    ↓
@solution-architect ออกแบบ architecture + tech stack
    → ได้ ADR (Architecture Decision Record)
    ↓
/tech-spec สร้าง technical specification
    → ได้ spec ที่ลูกค้า sign off
    ↓
/estimate breakdown งานและเวลา
    → ได้ timeline + ทีมที่ต้องการ
    ↓
/project-kickoff setup project ใหม่
    → ได้ repo structure, CI/CD, environments
```

### Phase 3: Delivery — พัฒนา

```
ทำงานแต่ละ feature
    ↓
@backend-dev หรือ @frontend-dev ช่วยเขียน + review code
    ↓
/code-review-pr ก่อน merge ทุก PR สำคัญ
    ↓
@security-auditor scan ก่อน release
    ↓
/deploy-check ก่อน deploy ทุกครั้ง
    ↓
Demo ลูกค้าทุก sprint end
```

### Phase 4: Handover — ส่งมอบ

```
UAT เสร็จ ลูกค้า approve
    ↓
/go-live-checklist 1–2 วันก่อน go-live
    ↓
@doc-writer เขียน user manual ภาษาไทย
    ↓
/user-training เตรียม training session
    ↓
/handover สร้าง handover package ครบชุด
    ↓
ลูกค้า sign acceptance ✓
```

### Phase 5: MA/Support — ดูแลหลัง go-live

```
ลูกค้าแจ้งปัญหา
    ↓
/bug-triage วิเคราะห์ priority + root cause
    ↓
@backend-dev หรือ @frontend-dev แก้ไข
    ↓
ทุกต้นเดือน: /monthly-report สรุป uptime, tickets, improvements
```

---

## 9. ตัวอย่างการใช้งานจริง

### ตัวอย่าง 1: รับลูกค้าใหม่ — ระบบ POS ร้านสะดวกซื้อ

```
# Step 1: Discovery
@sales-consultant 
ลูกค้า: GoAlong-Soft ธุรกิจ: ร้านสะดวกซื้อ 3 สาขา
ต้องการ: ระบบ POS + Stock + PO
งบ: 250,000 บาท timeline: 3 เดือน
ช่วยสรุป scope และ risk flags

# Step 2: Architecture
@solution-architect
ออกแบบ architecture สำหรับ POS + Stock + PO
งบ server ไม่เกิน 3,000 บาท/เดือน
ทีม: senior 1, mid 2

# Step 3: Spec + Estimate
/tech-spec
/estimate

# Step 4: Proposal
/proposal
ลูกค้า: GoAlong-Soft | งาน: POS System | งบ: 250,000 | timeline: 3 เดือน
```

### ตัวอย่าง 2: Sprint delivery — implement API

```
# เขียน API
@backend-dev
ช่วย implement endpoint POST /api/orders
ต้องรับ cart items, คำนวณราคา + ส่วนลด, สร้าง order, ลด stock
ใช้ Node.js + Fastify + PostgreSQL (Prisma)
มี unit test ด้วย

# Review ก่อน merge
/code-review-pr

# Deploy
/deploy-check
```

### ตัวอย่าง 3: รับ bug report

```
# Bug จากลูกค้า
/bug-triage
Bug: ราคาสินค้าไม่ถูกต้องเมื่อมี discount + coupon พร้อมกัน
ผู้แจ้ง: ลูกค้า Acme Corp
Priority: P1 (กระทบ production)

# แก้ไข
@backend-dev
bug: promotion calculation logic ใน orders.service.ts
เมื่อ apply coupon หลัง discount ราคาสุดท้ายผิด
ช่วย debug และ fix พร้อม test case
```

### ตัวอย่าง 4: ก่อน go-live

```
/go-live-checklist

@doc-writer
เขียน user manual ภาษาไทยสำหรับ cashier
ครอบคลุม: เปิดขาย, รับเงิน, ยกเลิก order, ปิดวัน
format: PDF พร้อม screenshot

/user-training
กลุ่มเป้าหมาย: cashier 5 คน, supervisor 2 คน
เวลา: 3 ชั่วโมง
```

### ตัวอย่าง 5: ใช้ Agent + Skill ร่วมกันใน workflow เดียว

```
ลูกค้า: ต้องการเพิ่ม feature loyalty points

1. /estimate  feature: loyalty points system
              scope: earn points, redeem, tier status

2. @backend-dev ออกแบบ database schema สำหรับ loyalty
               และ API endpoints

3. @frontend-dev สร้าง UI สำหรับ cashier แสดง points
                mobile-first, ภาษาไทย

4. @security-auditor ตรวจ points manipulation vulnerabilities

5. /code-review-pr ก่อน merge

6. /deploy-check ก่อน push production
```

---

## 10. Memory System

Memory ช่วยให้ Claude จำ context ข้ามเซสชัน ไม่ต้อง brief ซ้ำทุกครั้ง

### ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | เก็บอะไร | อยู่ที่ไหน |
|---|---|---|
| `MEMORY.md` | Index ของทุก memory | `~/.claude/projects/[project]/memory/` |
| `*.md` | Memory แต่ละอัน | `~/.claude/projects/[project]/memory/` |

### ประเภท Memory

| ประเภท | เก็บอะไร | ตัวอย่าง |
|---|---|---|
| `user` | ข้อมูลเกี่ยวกับผู้ใช้ | "user เชี่ยวชาญ Go, เพิ่งเริ่มทำ React" |
| `feedback` | feedback ที่ user ให้ไว้ | "ไม่ mock database ใน test — เคยเจอปัญหา" |
| `project` | ข้อมูล project ที่สำคัญ | "ใช้ Redis สำหรับ session, ตัดสินใจ 5 มิ.ย." |
| `reference` | ที่อยู่ของข้อมูลภายนอก | "bugs track ใน Linear project INGEST" |

### วิธีใช้

```
# บอก Claude ให้บันทึก
"บันทึกลง memory ว่าเราตัดสินใจใช้ PostgreSQL ไม่ใช่ MongoDB 
เพราะต้องการ ACID transactions สำหรับ inventory"

# ขอให้ Claude เรียก memory
"ช่วย recall ว่า architecture decision ของ POS system เราเป็นอะไร"
```

---

## 11. Tips & Best Practices

### การเรียก Agent ให้ได้ผลดี

```
❌ ไม่ดี:
@backend-dev ช่วย API หน่อย

✅ ดี:
@backend-dev
งาน: implement POST /api/orders
context: ระบบ POS ร้านสะดวกซื้อ, ใช้ Node.js + Fastify + Prisma
requirement:
  - รับ cart items[] + customer_id + payment_method
  - validate stock ก่อน confirm order
  - สร้าง order record + ลด stock ใน transaction
  - return order_id + total_amount
มี unit test ด้วย
```

### การเรียก Skill ให้ได้ผลดี

```
❌ ไม่ดี:
/proposal

✅ ดี:
/proposal
ลูกค้า: บริษัท ABC จำกัด (ร้านอาหาร 5 สาขา)
งาน: ระบบ POS + inventory + รายงาน
งบ: 400,000–600,000 บาท
timeline: 4 เดือน
ทีม client: IT manager 1 คน (technical background พอใช้)
เน้น: ROI และ ease of use สำหรับพนักงาน
```

### อย่าลืม

```
1. Brief context ก่อนเสมอ — agent ไม่รู้ project ของคุณ
2. ระบุ tech stack ที่ใช้อยู่ — อย่าให้ agent เดา
3. บอก constraint — งบ, timeline, team size
4. หลาย agent ทำงานร่วมกันได้ใน session เดียวกัน
5. Memory ช่วยได้ — ให้ Claude บันทึก decision สำคัญ
```

### Forbidden Actions (ทำไม่ได้ทุกกรณี)

Framework ป้องกัน action อันตรายเหล่านี้โดยอัตโนมัติ:

```
🚫 ลบไฟล์โดยไม่ขออนุญาต
🚫 Run database migration โดยไม่แจ้งก่อน
🚫 Deploy production โดยไม่ได้รับ approval
🚫 แก้ไข .env, docker-compose.prod.yml โดยไม่แจ้ง
🚫 rm -rf ทุกกรณี
🚫 Force push บน main/master
🚫 Commit ไฟล์ที่มี credentials
```

---

## ดูเพิ่มเติม

- [README.md](./README.md) — setup และ architecture overview
- [example-use.md](./example-use.md) — ตัวอย่าง workflow จริง (POS system)
- [CHANGELOG.md](./CHANGELOG.md) — history การเปลี่ยนแปลง framework
- Dashboard: `http://localhost:3333` — ดู agents, skills, clients, members

---

*Claude Code Framework v4.0 — GoAlong Software House*
