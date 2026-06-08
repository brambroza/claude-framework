---
name: proposal
description: สร้าง proposal ฉบับเต็มสำหรับ SME ไทย ครอบคลุมตั้งแต่ executive summary ถึง technical approach และราคา — ใช้หลัง discovery session
allowed-tools:
  - Read
  - Write
context: fork
---

# Proposal Skill

## Input ที่ต้องการก่อนสร้าง
- ชื่อบริษัทลูกค้า + ชื่อ contact
- Scope Brief จาก sales-consultant
- Estimate จากทีม (ถ้ามี)
- Portfolio ที่ใกล้เคียงที่สุด 1-2 project

## โครงสร้าง Proposal (SME ไทย)

```markdown
# [ชื่อ Project] — Proposal
บริษัท [ชื่อ Software House]
วันที่: [วันที่] | อายุ: 30 วัน

---

## 1. บทสรุปผู้บริหาร (Executive Summary)
[2-3 ประโยค: เราเข้าใจปัญหาของคุณอะไร และเราจะแก้ยังไง]
[ไม่มี jargon — อ่านได้ภายใน 30 วินาที]

## 2. ความเข้าใจในปัญหา (Problem Understanding)
[แสดงว่าเราฟังและเข้าใจ business จริงๆ]
- ปัญหาปัจจุบัน: ...
- ผลกระทบต่อธุรกิจ: ...
- สิ่งที่ต้องการ: ...

## 3. Solution ที่นำเสนอ
### สิ่งที่จะได้รับ
[bullet points สั้นๆ ที่ลูกค้าเข้าใจได้ทันที]
- ✅ [feature 1 — ประโยชน์ที่ได้]
- ✅ [feature 2 — ประโยชน์ที่ได้]

### สิ่งที่ไม่อยู่ใน scope นี้
[ชัดเจน เพื่อป้องกัน scope creep]
- ❌ [สิ่งที่ไม่รวม] (สามารถทำเป็น phase 2 ได้)

## 4. แนวทางการพัฒนา (Approach)
[อธิบายแบบที่ไม่ใช่ technical — SME ไม่สนใจ tech stack]
- Phase 1 (X สัปดาห์): [สิ่งที่จะเห็น/ได้รับ]
- Phase 2 (X สัปดาห์): [สิ่งที่จะเห็น/ได้รับ]
- UAT & Go-live (X สัปดาห์): [กระบวนการ]

## 5. Timeline
[ตาราง Gantt แบบง่าย]
| Phase | ระยะเวลา | Milestone |
|---|---|---|

## 6. ราคา (Investment)

### Package ที่แนะนำ: [Standard/Premium]
| รายการ | มูลค่า |
|---|---|
| Development | XXX,XXX |
| Testing & QA | รวมอยู่แล้ว |
| Training | รวมอยู่แล้ว |
| **รวม** | **XXX,XXX บาท** |

**เงื่อนไขการชำระ:**
- 30% เมื่อเซ็นสัญญา
- 30% เมื่อ demo phase 1
- 30% เมื่อ UAT ผ่าน
- 10% เมื่อ go-live

### MA Package (หลัง go-live)
| Package | รายเดือน | ครอบคลุม |
|---|---|---|
| Basic | X,XXX | Bug fix, 8x5 support |
| Standard | XX,XXX | + Feature request 8h/month |

## 7. เหตุผลที่เลือกเรา
- [portfolio ที่ใกล้เคียง — ชื่อ project + ผลลัพธ์จริง]
- ทีมไทย คุยภาษาไทย ดูแลหลัง go-live จริง
- Fixed price ไม่มีค่าใช้จ่ายแอบแฝง

## 8. ขั้นตอนถัดไป
1. ยืนยัน proposal ภายใน [วันที่]
2. Workshop requirement 1 วัน
3. เซ็นสัญญาและเริ่มงาน

---
**ติดต่อ:** [ชื่อ] | [เบอร์] | Line: [ID]
```

## หลักการเขียน Proposal สำหรับ SME ไทย
- หน้า 1 ต้องตอบได้ว่า "ได้อะไร ใช้เวลาเท่าไหร่ ราคาเท่าไหร่"
- ใช้ภาษาธุรกิจ ไม่ใช้คำว่า API, microservice, CI/CD
- แสดงว่าเข้าใจ business ไม่ใช่แค่ technical
- ราคาต้องมีอย่างน้อย 2 tier ให้เลือก
- เสมอระบุ "ไม่รวมอะไร" อย่างชัดเจน
