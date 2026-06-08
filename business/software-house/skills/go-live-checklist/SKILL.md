---
name: go-live-checklist
description: ตรวจสอบความพร้อมก่อน go-live production ครอบคลุมทุกด้าน — ใช้ 1-2 วันก่อน go-live
allowed-tools:
  - Bash
  - Read
context: fork
---

# Go-Live Checklist Skill

## วิธีใช้
รัน checklist ทีละข้อ บันทึก Pass/Fail/N-A พร้อมหมายเหตุ
ห้าม go-live ถ้ามี CRITICAL ที่ยัง Fail

---

## 🔴 CRITICAL — ต้องผ่านทั้งหมดก่อน go-live

### Security
- [ ] HTTPS เปิดใช้งาน, HTTP redirect ไป HTTPS
- [ ] SSL certificate valid และไม่หมดอายุใน 30 วัน
- [ ] Environment variables ไม่มีใน code หรือ git history
- [ ] Database ไม่เปิด public port (เข้าได้แค่ผ่าน private network)
- [ ] Admin password เปลี่ยนจาก default แล้ว
- [ ] Debug mode ปิดใน production
- [ ] Error messages ไม่แสดง stack trace ให้ user เห็น

### Functionality
- [ ] ทุก feature ใน scope ผ่าน UAT แล้ว
- [ ] Regression test ผ่านทั้งหมด
- [ ] Payment flow ทดสอบแล้ว (ถ้ามี)
- [ ] Email/SMS notification ส่งได้จริง
- [ ] File upload/download ทำงานได้

### Data
- [ ] Production database migrate แล้ว
- [ ] Seed data / master data ครบถ้วน
- [ ] Backup ทำก่อน go-live แล้ว
- [ ] ทดสอบ restore จาก backup สำเร็จ

### Infrastructure
- [ ] Server resources เพียงพอ (CPU < 50%, RAM < 70%)
- [ ] Disk space เพียงพอ (ใช้ < 60%)
- [ ] Auto-restart เมื่อ crash เปิดอยู่ (PM2/systemd)
- [ ] Firewall rules ถูกต้อง

---

## 🟡 IMPORTANT — ควรผ่านก่อน go-live

### Performance
- [ ] Page load time < 3 วินาที บน mobile 4G
- [ ] Database query ที่ใช้บ่อยมี index แล้ว
- [ ] Static assets มี cache headers

### Monitoring
- [ ] Uptime monitoring เปิดอยู่ (UptimeRobot)
- [ ] Error tracking เปิดอยู่ (Sentry)
- [ ] Alert ไป Line/email เมื่อ down

### Backup
- [ ] Daily backup อัตโนมัติ configured แล้ว
- [ ] Backup ไปที่ที่ไม่ใช่ server เดียวกัน

### Documentation
- [ ] Runbook ส่งให้ลูกค้า IT แล้ว
- [ ] Support contact ชัดเจน

---

## 🟢 NICE TO HAVE

- [ ] CDN setup
- [ ] Load testing ผ่าน
- [ ] Staging environment ยัง active ไว้ (สำหรับ hotfix test)

---

## Rollback Plan (ต้องมีก่อน go-live)

```markdown
## Rollback Plan — [Project Name]
เตรียมวันที่: [วันที่]

### ถ้าต้อง rollback:
1. [ขั้นตอน 1]
2. [ขั้นตอน 2]
3. Notify ลูกค้าด้วย message นี้:
   "ขณะนี้ทีมเทคนิคกำลังแก้ไขปัญหา คาดว่าจะกลับมาใช้งานได้ภายใน [X ชั่วโมง]"

### ใครทำ rollback: [ชื่อ + เบอร์]
### ใช้เวลา: ~[X] นาที
### Database rollback point: [timestamp ของ backup]
```

---

## Go-Live Report Template

```markdown
# Go-Live Report — [Project]
วันที่: [วันที่] เวลา: [เวลา]

## Summary
✅ CRITICAL: X/X ผ่าน
✅ IMPORTANT: X/X ผ่าน
⚠️ NICE TO HAVE: X/X ผ่าน

## Known Issues (จะแก้ใน patch แรก)
- [issue]

## Post Go-Live Monitoring
- ติดตาม error rate 24 ชั่วโมงแรก
- Daily check ใน 7 วันแรก

## ผู้รับผิดชอบ On-call (48h แรก)
[ชื่อ] | [เบอร์]
```
