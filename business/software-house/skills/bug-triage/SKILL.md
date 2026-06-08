---
name: bug-triage
description: วิเคราะห์ bug report ตั้งแต่รับแจ้งจนถึง resolve — ใช้เมื่อได้รับ bug report จากลูกค้าหรือทีม
allowed-tools:
  - Read
  - Write
  - Bash
context: fork
---

# Bug Triage Skill

## กระบวนการ Triage

### Step 1: รับ bug report
รับข้อมูลจากลูกค้า:
- อาการที่พบคืออะไร
- ทำอะไรอยู่ก่อนเกิดปัญหา
- เกิดกับทุกคนหรือแค่บางคน
- เริ่มเกิดตั้งแต่เมื่อไหร่
- screen recording หรือ screenshot (ขอเสมอ)

### Step 2: Classify Priority

```
P1 — Critical (แก้ภายใน 24h)
   - ระบบใช้ไม่ได้เลย
   - ข้อมูลสูญหายหรือเสียหาย
   - security breach
   - ลูกค้าทุกคนได้รับผลกระทบ

P2 — High (แก้ภายใน 72h)
   - Feature สำคัญทำงานผิดพลาด
   - มี workaround แต่ไม่สะดวก
   - กระทบผู้ใช้บางส่วน

P3 — Medium (แก้ใน next sprint)
   - Feature รอง
   - Cosmetic issues
   - Edge case ที่เกิดน้อยมาก
```

### Step 3: Reproduce

```bash
# ดู production logs ช่วงเวลาที่เกิดปัญหา
# (ใส่ command จริงตาม project)

# ตรวจ error tracking
# Sentry: [URL]

# ตรวจ database
# SELECT * FROM ... WHERE ... AND created_at >= '...'
```

### Step 4: Root Cause Analysis Template

```markdown
## Bug Report #[ID]
**วันที่รับแจ้ง:** [วันที่]
**Priority:** P[1/2/3]
**Reported by:** [ชื่อลูกค้า]

### อาการ
[อธิบายปัญหาที่ลูกค้าเห็น]

### Steps to Reproduce
1. [ขั้นตอน]
2. [ขั้นตอน]
Expected: [ผลที่ควรเป็น]
Actual: [ผลที่เกิดจริง]

### Root Cause
[สาเหตุที่แท้จริง]

### Fix
[สิ่งที่แก้]
[File/function ที่เปลี่ยน]

### Test
- [ ] Reproduce จากขั้นตอนเดิมไม่ได้แล้ว
- [ ] Regression test ผ่าน
- [ ] Test บน staging แล้ว

### Deployed
- Staging: [วันเวลา]
- Production: [วันเวลา]
```

### Step 5: Post-mortem (สำหรับ P1 เท่านั้น)

```markdown
## P1 Post-mortem — [ชื่อ incident]
**Duration:** [เริ่ม] → [จบ] (รวม X ชั่วโมง)
**Impact:** กระทบ [X คน/ทุกคน]

### Timeline
- [เวลา] ลูกค้าแจ้ง
- [เวลา] ทีม investigate
- [เวลา] พบสาเหตุ
- [เวลา] deploy fix
- [เวลา] confirm resolved

### Root Cause
[สาเหตุ]

### แก้ระยะยาว (ป้องกันไม่ให้เกิดซ้ำ)
- [ ] [action 1]
- [ ] [action 2]
```

## Common Bugs ใน SME Projects และวิธีแก้เร็ว

| Bug Pattern | มักเกิดจาก | วิธีตรวจ |
|---|---|---|
| ข้อมูลหาย | soft delete ไม่ทำงาน | ดู deleted_at ใน DB |
| ส่ง email ไม่ได้ | SMTP config / rate limit | ดู mail logs |
| ช้ามากหลัง user เยอะ | missing index | pg_stat_statements |
| login ไม่ได้ | JWT expire / session หาย | ดู auth logs |
| export Excel เสีย | data format / encoding | ดู field ที่มี special chars |
