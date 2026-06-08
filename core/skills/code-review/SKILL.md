---
name: code-review
description: ทำ code review อย่างละเอียด ตรวจ quality, security, performance — ใช้เมื่อต้องการ review diff หรือ PR
allowed-tools:
  - Read
  - Bash
context: fork
---

# Code Review Skill

## ขั้นตอน

1. รับ diff หรือ path ที่ต้องการ review
2. อ่าน context — ทำความเข้าใจ feature ที่เปลี่ยน
3. ตรวจทีละด้านตาม checklist
4. สรุปเป็น structured report

## Checklist

### Correctness
- [ ] Logic ถูกต้องตาม requirement
- [ ] Edge cases ครอบคลุม (null, empty, boundary)
- [ ] Error handling ครบถ้วน
- [ ] Async/await ใช้ถูกต้อง ไม่มี race condition

### Security
- [ ] ไม่มี SQL/Command injection
- [ ] Input validation ครบ
- [ ] Authorization ตรวจก่อนเข้าถึง resource
- [ ] ไม่มี sensitive data ใน log หรือ response

### Performance
- [ ] ไม่มี N+1 query
- [ ] ใช้ index สำหรับ query ที่ใช้บ่อย
- [ ] ไม่มี unnecessary computation ใน loop
- [ ] Caching ใช้อย่างเหมาะสม

### Maintainability
- [ ] ชื่อตัวแปรและ function สื่อความหมาย
- [ ] ไม่มี magic number หรือ magic string
- [ ] Function ทำหน้าที่เดียว (Single Responsibility)
- [ ] มี test ครอบคลุม happy path และ edge cases
- [ ] มี comment อธิบาย "ทำไม" ไม่ใช่แค่ "ทำอะไร"

## Output Format

```
## Code Review Report
**File:** path/to/file.ts
**Reviewer:** @security-auditor / @code-reviewer
**Status:** ✅ Approved | ⚠️ Approved with comments | ❌ Changes required

### 🔴 Critical
### 🟡 Warning  
### 🟢 Suggestion
### 💡 Positive feedback
```
