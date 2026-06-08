# Claude Framework Dashboard

Web monitor สำหรับ Claude Code Framework — GoAlong Software House

## Quick Start

```bash
cd dashboard
npm install
npm run dev
# เปิด http://localhost:3333
```

## Pages

| หน้า | URL | ทำอะไร |
|---|---|---|
| Overview | / | ภาพรวมวันนี้ — ทีม, tasks, issues, projects |
| Routines | /routines | งานประจำ — copy prompt ไปใช้ใน Claude Code |
| Goals | /goals | เป้าหมายทีมและ progress |
| Onboarding | /onboarding | checklist สำหรับสมาชิกใหม่ |
| Agents | /agents | agents ทั้งหมด + usage stats |
| Org | /org | pipeline, ทีม, framework layers |
| Skills | /skills | skills ทั้งหมด + copy command |
| Costs | /costs | budget, spending, token usage |
| Activity | /activity | tasks, issues, activity feed |
| Settings | /settings | org settings, rate card, SLA |

## Deploy (ทีม)

```bash
# Vercel (แนะนำ)
npm install -g vercel
vercel

# หรือ build เอง
npm run build
npm start
```

## ข้อมูล

ตอนนี้ใช้ mock data จาก `data/mockData.ts`
เชื่อมต่อ database จริงได้โดยแก้ไข `app/api/` routes

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (charts)
- Sarabun font (Thai)
