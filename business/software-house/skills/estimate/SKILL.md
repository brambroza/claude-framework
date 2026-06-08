---
name: estimate
description: Breakdown งานและ estimate ชั่วโมงอย่างละเอียด พร้อม timeline — ใช้หลัง scope confirm ก่อนเซ็นสัญญา
allowed-tools:
  - Read
  - Write
context: fork
---

# Estimate Skill

## หลักการ Estimate ที่แม่นยำ

### วิธีที่ใช้: 3-Point Estimation
```
Optimistic (O) : ถ้าทุกอย่างราบรื่น
Realistic (R)  : ปกติจริงๆ
Pessimistic (P): ถ้ามีปัญหา

Expected = (O + 4R + P) / 6
```

### Buffer ที่ต้องบวกเสมอ
```
Unclear requirement   : +30%
New technology        : +25%
Third-party integration: +20%
Tight deadline        : +15%
SME client (เปลี่ยนใจบ่อย): +20%
```

## Template Estimate

```markdown
# Project Estimate — [ชื่อ Project]
วันที่: [วันที่] | Estimator: [ชื่อ] | Version: 1.0
สถานะ: Draft / Confirmed

## Assumptions (สิ่งที่สมมติ — ถ้าเปลี่ยนต้อง re-estimate)
- [ ] Requirement ชัดเจนและ confirmed แล้ว
- [ ] ไม่มี integration กับระบบที่ไม่มี API
- [ ] ลูกค้า provide ข้อมูล/content ตาม schedule
- [ ] ไม่มีการเปลี่ยน tech stack กลางทาง

## Work Breakdown Structure

### 📐 Phase 0: Setup & Architecture (สัปดาห์ 1)
| Task | O | R | P | Expected | Who |
|---|---|---|---|---|---|
| Project setup, repo, CI/CD | 4 | 8 | 12 | 8 | DevOps |
| Database schema design | 4 | 8 | 16 | 8.7 | Senior Dev |
| Architecture review | 2 | 4 | 8 | 4.3 | Architect |
| **Phase 0 Total** | | | | **~21h** | |

### 🎨 Phase 1: [Module A] (สัปดาห์ 2-3)
| Task | O | R | P | Expected | Who |
|---|---|---|---|---|---|
| UI Design + Prototype | 8 | 16 | 24 | 16 | Designer |
| Frontend: [หน้า 1] | 8 | 12 | 20 | 12.7 | Mid Dev |
| Frontend: [หน้า 2] | 6 | 10 | 16 | 10.3 | Mid Dev |
| Backend: API [Module A] | 12 | 20 | 32 | 20.7 | Senior Dev |
| Unit Tests | 4 | 8 | 12 | 8 | Dev |
| **Phase 1 Total** | | | | **~68h** | |

### 🔧 Phase 2: [Module B] (สัปดาห์ 4-5)
[เหมือนกัน]

### 🔗 Integration & Testing (สัปดาห์ 6)
| Task | Expected |
|---|---|
| Integration testing | 16h |
| Performance testing | 8h |
| Security review | 8h |
| Bug fixes | 16h |
| **Total** | **48h** |

### 🚀 UAT & Go-live (สัปดาห์ 7)
| Task | Expected |
|---|---|
| UAT support | 16h |
| Bug fixes จาก UAT | 16h |
| Deployment to production | 8h |
| Training | 8h |
| Documentation | 8h |
| **Total** | **56h** |

## Summary

| Phase | Hours | Cost (Mid Rate) |
|---|---|---|
| Setup | 21h | XX,XXX |
| [Module A] | 68h | XX,XXX |
| [Module B] | XXh | XX,XXX |
| Integration | 48h | XX,XXX |
| UAT & Go-live | 56h | XX,XXX |
| **Raw Total** | **XXXh** | **XXX,XXX** |
| Buffer (20%) | +XXh | +XX,XXX |
| **Final** | **XXXh** | **XXX,XXX** |

## Timeline (Calendar)
| สัปดาห์ | วันที่ | Deliverable |
|---|---|---|
| Week 1 | [วันที่] | Project setup + Architecture |
| Week 2-3 | [วันที่] | [Module A] Demo |
| Week 4-5 | [วันที่] | [Module B] Demo |
| Week 6 | [วันที่] | Full system testing |
| Week 7 | [วันที่] | 🚀 Go-live |

## Dependencies (สิ่งที่ต้องการจากลูกค้า)
| สิ่งที่ต้องการ | ต้องได้ภายใน | Owner |
|---|---|---|
| Logo + Brand guide | Week 1 Day 1 | ลูกค้า |
| ข้อมูล master data | Week 2 | ลูกค้า |
| UAT Testers | Week 6 | ลูกค้า |
| Server credentials | Week 1 | ลูกค้า IT |
```
