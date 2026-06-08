---
name: compliance-check
description: ตรวจสอบ compliance ด้าน security และ data privacy — ใช้ก่อน release หรือ audit
allowed-tools:
  - Read
  - Bash
context: fork
---

# Compliance Check Skill

## Checklist

### Data Privacy (PDPA/GDPR)
- [ ] มี privacy policy ที่อัพเดต
- [ ] consent mechanism สำหรับเก็บข้อมูล
- [ ] right to access — user ขอดูข้อมูลตัวเองได้
- [ ] right to erasure — ลบข้อมูลได้เมื่อร้องขอ
- [ ] data breach notification process
- [ ] data retention policy และ auto-deletion

### Security (ISO 27001)
- [ ] access control — least privilege
- [ ] MFA สำหรับ admin accounts
- [ ] encryption at rest (database, file storage)
- [ ] encryption in transit (TLS 1.2+)
- [ ] vulnerability scanning routine
- [ ] incident response plan

### Audit Trail
- [ ] log ทุก login/logout
- [ ] log ทุก data access ที่ sensitive
- [ ] log ทุก admin action
- [ ] logs immutable และ tamper-evident
- [ ] log retention อย่างน้อย 1 ปี

### Change Management
- [ ] มี change request document
- [ ] ผ่าน CAB approval
- [ ] มี rollback plan
- [ ] มี test evidence
- [ ] post-change monitoring plan

## Output
รายงาน compliance status พร้อม:
- Pass / Fail / N/A ในแต่ละ item
- Gap analysis
- Remediation priority และ timeline
