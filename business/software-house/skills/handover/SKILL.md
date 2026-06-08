---
name: handover
description: สร้าง handover package ครบชุดสำหรับส่งมอบงานให้ลูกค้า — ใช้เมื่อเตรียม go-live และส่งมอบ project
allowed-tools:
  - Read
  - Write
context: fork
---

# Handover Skill

## Package ที่ต้องส่งมอบ (Checklist)

### 📁 Technical Documents
- [ ] README.md (setup, run, deploy)
- [ ] Architecture diagram
- [ ] API documentation
- [ ] Database schema + ERD
- [ ] Environment variables list (ไม่รวม values)
- [ ] Runbook (restart, logs, common issues)
- [ ] CI/CD pipeline description

### 👥 User Documents (ภาษาไทย)
- [ ] User Manual — คู่มือการใช้งาน
- [ ] Admin Guide — คู่มือสำหรับ admin
- [ ] Quick Reference Card — สรุป 1 หน้า A4
- [ ] FAQ

### 🔐 Credentials & Access
- [ ] Source code repository access
- [ ] Server access (SSH key หรือ password manager)
- [ ] Database credentials
- [ ] Third-party service accounts
- [ ] Domain / DNS access
- [ ] SSL certificate info
- [ ] All credentials ส่งผ่าน secure channel (ไม่ใช่ email)

### 🏋️ Training
- [ ] Training session จัดเรียบร้อย
- [ ] Recording (ถ้ามี)
- [ ] Training materials ส่งให้แล้ว

## Template: คู่มือการใช้งาน (User Manual)

```markdown
# คู่มือการใช้งาน [ชื่อระบบ]
สำหรับ: [ชื่อบริษัทลูกค้า]
เวอร์ชัน: 1.0 | วันที่: [วันที่]

---

## 1. เริ่มต้นใช้งาน
### การ Login
1. เปิด browser ไปที่ [URL]
2. กรอก Email และ Password
3. กด "เข้าสู่ระบบ"

[ภาพหน้าจอ]

### ถ้าลืม Password
[ขั้นตอน]

---

## 2. [Module A: ชื่อ]
### [หน้าหลัก]
[อธิบายแต่ละส่วน พร้อมภาพหน้าจอ]

### วิธีสร้าง [สิ่งที่ทำบ่อย]
1. คลิก "[ปุ่ม]"
2. กรอกข้อมูล [field]
3. กด "บันทึก"

[ภาพหน้าจอ]

---

## 3. คำถามที่พบบ่อย (FAQ)

**ถาม: [คำถาม]**
ตอบ: [คำตอบ]

---

## 4. การติดต่อ Support
- Line: [ID]
- Email: [อีเมล]
- เวลาทำการ: จ-ศ 09:00-18:00
- กรณีเร่งด่วน (P1): [เบอร์มือถือ]
```

## Template: Admin Guide

```markdown
# คู่มือผู้ดูแลระบบ [ชื่อระบบ]

## การจัดการ Users
- เพิ่ม/ลบ/แก้ไข user
- กำหนด roles และ permissions
- Reset password

## การจัดการข้อมูล
- Export ข้อมูล
- Import ข้อมูล
- Backup ข้อมูล

## การ Monitor ระบบ
- ดู logs
- ตรวจสอบ uptime
- ตรวจสอบ disk space

## การ Restart ระบบ (กรณีฉุกเฉิน)
[ขั้นตอนชัดเจน — สมมติว่าไม่ใช่ developer]
```

## Template: Quick Reference Card (A4 1 หน้า)

```
┌─────────────────────────────────────────────┐
│         [ชื่อระบบ] — Quick Reference         │
├─────────────────────────────────────────────┤
│ URL: [url]    Login: [วิธีการ]               │
├─────────────────────────────────────────────┤
│ งานที่ทำบ่อย          │ ปุ่ม/เมนู            │
│ [งาน 1]               │ [วิธี]               │
│ [งาน 2]               │ [วิธี]               │
│ [งาน 3]               │ [วิธี]               │
├─────────────────────────────────────────────┤
│ มีปัญหา? ติดต่อ: Line [ID] | [เบอร์]         │
└─────────────────────────────────────────────┘
```

## Handover Meeting Agenda
```
1. Demo ระบบทั้งหมด (30 นาที)
2. ส่งมอบ credentials (15 นาที)
3. Q&A (15 นาที)
4. เซ็น Acceptance Form
5. อธิบาย MA Package และ support process
```

## Acceptance Form
```markdown
# ใบรับมอบงาน (Acceptance Form)
โครงการ: [ชื่อ]
วันที่ส่งมอบ: [วันที่]

## รายการที่ส่งมอบ
- [ ] Source code
- [ ] Documents ครบถ้วน
- [ ] Training เรียบร้อย
- [ ] System ทำงานถูกต้องตาม requirement

ผู้ส่งมอบ: _________________ วันที่: _______
ผู้รับมอบ: _________________ วันที่: _______

หมายเหตุ: Warranty 3 เดือนเริ่มวันนี้
```
