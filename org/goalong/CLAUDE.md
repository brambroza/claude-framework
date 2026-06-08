# ============================================================
# ORG LAYER: GoAlong Software House
# ============================================================

## [SECTION: org-identity]
- Organization: GoAlong
- Industry: Software House
- Primary Language: ภาษาไทย (default), EN เมื่อจำเป็น
- Working Hours: จ-ศ 09:00-18:00 ICT
- Target Market: SME ไทย, Enterprise ไทย

## [SECTION: sme-thai-context]
# Context สำคัญที่ทุกคนในทีมต้องรู้
- ลูกค้า SME ไทยตัดสินใจจาก "ราคา + ความไว้ใจ" มากกว่า feature list
- Communication หลักคือ Line ไม่ใช่ email
- ลูกค้าชอบ Fixed Price — ไม่ชอบ T&M หรือ hourly billing
- เปลี่ยน requirement บ่อย — ต้องมี change control process
- ต้องการ document และ training ภาษาไทย
- อยากเห็น prototype เร็ว — demo บ่อยดีกว่ารอนาน
- กลัว 3 อย่าง: ส่งไม่ตรงเวลา, ราคาบาน, บริษัทหายหลัง go-live

## [SECTION: tech-defaults][OVERRIDE]
- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: Node.js (Fastify) + TypeScript
- Database: PostgreSQL + Prisma ORM
- Cache: Redis (เมื่อจำเป็น)
- Infrastructure: DigitalOcean (VPS หรือ App Platform)
- CI/CD: GitHub Actions
- Error Tracking: Sentry
- Uptime Monitor: UptimeRobot
- Communication: Line Notify สำหรับ alerts

## [SECTION: pricing]
- Rate Card: Junior 500, Mid 800, Senior 1,200, Designer 700, PM 900, QA 500, DevOps 1,000 (บาท/ชั่วโมง)
- Buffer: +20% SME client, +15% unclear requirement, +25% new technology
- Margin: 25-35%
- Minimum project: 150,000 บาท
- MA minimum: 5,000 บาท/เดือน

## [SECTION: sla]
- P1 Response: 1 ชั่วโมง, Resolve: 24 ชั่วโมง
- P2 Response: 4 ชั่วโมง, Resolve: 72 ชั่วโมง
- P3 Response: 24 ชั่วโมง, Resolve: Next sprint
- Uptime SLA: 99.5%
- Support hours: จ-ศ 09:00-18:00 (P1: 24/7)

## [SECTION: delivery-standards]
- ทุก project ต้องมี staging environment แยกจาก production
- Demo ลูกค้าทุก 1 สัปดาห์อย่างน้อย
- UAT อย่างน้อย 1 สัปดาห์ก่อน go-live
- Warranty 3 เดือนหลัง go-live (bug fix ฟรี)
- Handover package: user manual (TH), runbook, source code, credentials

## [SECTION: change-management]
- Requirement change หลังเซ็น spec → ต้องมี Change Request (CR)
- CR ต้องระบุ: scope ที่เพิ่ม, เวลาที่เพิ่ม, ราคาที่เพิ่ม
- ลูกค้า approve CR ก่อนเริ่มทำเสมอ
- ไม่มี verbal approval — ต้องเป็น Line หรือ email

## [SECTION: escalation]
- Architecture change → Technical Lead
- Budget change → Project Lead + Management
- Client complaint → Project Lead ภายใน 2 ชั่วโมง
- P1 incident → Technical Lead + Management ทันที
