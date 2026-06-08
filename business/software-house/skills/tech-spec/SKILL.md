---
name: tech-spec
description: เขียน technical specification จาก requirement — ใช้ก่อนเริ่ม develop feature ใหม่
allowed-tools:
  - Read
  - Write
context: fork
---

# Tech Spec Skill

## Output Template

```markdown
# Technical Specification: [Feature Name]

**Ticket:** [TICKET-ID]
**Author:** [ชื่อ]
**Date:** [วันที่]
**Status:** Draft | In Review | Approved

---

## 1. Overview
[อธิบาย feature ใน 2-3 ประโยค ทำไมถึงต้องทำ]

## 2. Goals
- [goal 1]
- [goal 2]

## 3. Non-goals (สิ่งที่ไม่ทำใน scope นี้)
- [non-goal 1]

## 4. User Stories
- As a [role], I want to [action], so that [benefit]

## 5. Technical Design

### 5.1 Architecture
[diagram หรืออธิบาย]

### 5.2 Data Model
\`\`\`typescript
interface [ModelName] {
  id: string
  // fields...
}
\`\`\`

### 5.3 API Endpoints
\`\`\`
POST /api/[resource]
GET  /api/[resource]/:id
\`\`\`

### 5.4 Business Logic
[อธิบาย logic สำคัญ]

## 6. Security Considerations
- [ความเสี่ยงและวิธีจัดการ]

## 7. Performance Considerations
- [expected load, caching strategy]

## 8. Testing Plan
- Unit tests: [สิ่งที่ต้อง test]
- Integration tests: [scenarios]
- Manual QA: [test cases]

## 9. Rollout Plan
- [ ] Deploy to staging
- [ ] QA testing
- [ ] Client review
- [ ] Deploy to production
- [ ] Monitor for 48h

## 10. Open Questions
- [ ] [คำถามที่ยังไม่ได้ตอบ]
```

## วิธีใช้
1. รับ requirement หรือ ticket
2. สร้าง spec ตาม template
3. highlight สิ่งที่ต้องการ clarification
4. บันทึกไฟล์ที่ `docs/specs/[ticket-id]-[feature-name].md`
