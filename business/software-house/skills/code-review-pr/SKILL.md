---
name: code-review-pr
description: ทำ full code review สำหรับ PR พร้อมเขียน review comments — ใช้เมื่อต้องการ review PR ก่อน merge
allowed-tools:
  - Bash
  - Read
context: fork
---

# PR Code Review Skill

## ขั้นตอน

### 1. ดู diff
```bash
git diff main...HEAD --stat
git diff main...HEAD
```

### 2. ตรวจตาม checklist

**Functionality**
- [ ] ทำงานตาม requirement ไหม
- [ ] Edge cases ครอบคลุมไหม

**Code Quality**
- [ ] อ่านเข้าใจง่ายไหม
- [ ] มี duplication ที่ควร extract ไหม
- [ ] ชื่อตัวแปรสื่อความหมายไหม

**Tests**
- [ ] มี tests ครอบคลุม happy path
- [ ] มี tests ครอบคลุม error cases
- [ ] Tests มีความหมาย ไม่ใช่แค่ coverage

**Security**
- [ ] ไม่มี injection vulnerability
- [ ] Authorization ถูกต้อง
- [ ] ไม่มี secret ใน code

**Performance**
- [ ] ไม่มี N+1 query
- [ ] ไม่มี unnecessary re-render (React)

### 3. เขียน Review Comments

สำหรับแต่ละ issue ใช้ format:

```
**[SEVERITY]** `path/to/file.ts:LINE`

**Issue:** [อธิบายปัญหา]

**Why it matters:** [ผลกระทบ]

**Suggestion:**
\`\`\`typescript
// แบบที่แนะนำ
\`\`\`
```

SEVERITY: 🔴 CRITICAL | 🟡 MINOR | 💡 NIT | ✨ PRAISE

### 4. Final Verdict

```
## Review Summary

**Verdict:** ✅ Approve | 🔄 Request Changes | 💬 Comment

**Summary:** [2-3 ประโยคสรุป]

**Must fix before merge:**
- [ ] item 1

**Nice to have:**
- [ ] item 1
```
