---
name: pricing
description: คำนวณราคา estimate จาก scope และสร้าง quotation พร้อม tier — ใช้หลัง scope analysis และก่อนส่ง proposal
allowed-tools:
  - Read
  - Write
context: fork
---

# Pricing Skill

## Rate Card (ปรับได้ใน org CLAUDE.md)
```
Junior Dev      : 500 บาท/ชั่วโมง
Mid Dev         : 800 บาท/ชั่วโมง
Senior Dev      : 1,200 บาท/ชั่วโมง
UX/UI Designer  : 700 บาท/ชั่วโมง
PM              : 900 บาท/ชั่วโมง
QA              : 500 บาท/ชั่วโมง
DevOps          : 1,000 บาท/ชั่วโมง
```

## กระบวนการคำนวณ

### Step 1: Breakdown งานเป็น tasks
รับ scope แล้วแจกแจงเป็น work items:
```
Frontend:
  - หน้า Login/Auth          : 8h
  - หน้า Dashboard           : 16h
  - หน้า [Feature A]         : 24h
  ...

Backend:
  - API Auth + JWT           : 8h
  - API [Module A]           : 20h
  ...

Database:
  - Schema design + migration: 8h
  ...

DevOps:
  - Setup server + CI/CD     : 16h
  ...

QA:
  - Test planning + execution: [20% ของ dev hours]

PM:
  - Sprint planning + meetings: [15% ของ dev hours]
```

### Step 2: คำนวณราคาฐาน
```
Raw Cost = Σ (hours × rate ตาม level)
```

### Step 3: บวก buffers
```
Technical Risk Buffer  : +15% (integration, unclear spec)
Revision Buffer        : +10% (ลูกค้า SME เปลี่ยนใจบ่อย)
Business Margin        : +25-35%
─────────────────────────────
Final Price = Raw Cost × 1.5-1.6
```

### Step 4: สร้าง 3 Tiers

**Basic** — ตัด nice-to-have ออก, ใช้ junior/mid
**Standard** ⭐ แนะนำ — scope เต็ม, mix senior/mid
**Premium** — เพิ่ม features, dedicated senior, faster timeline

## Output: Quotation Template

```markdown
# ใบเสนอราคา (Quotation)
เลขที่: QT-[YYYY]-[NNN]
วันที่: [วันที่]  |  อายุ: 30 วัน

## ข้อมูลลูกค้า
บริษัท: [ชื่อ]
โครงการ: [ชื่อ]
ติดต่อ: [ชื่อ]

## รายการงาน

| # | รายการ | Basic | Standard | Premium |
|---|---|---|---|---|
| 1 | [Module A] | ✅ | ✅ | ✅ |
| 2 | [Module B] | ❌ | ✅ | ✅ |
| 3 | [Module C] | ❌ | ❌ | ✅ |

## ราคา

| | Basic | Standard ⭐ | Premium |
|---|---|---|---|
| ราคาพัฒนา | XXX,XXX | XXX,XXX | X,XXX,XXX |
| ระยะเวลา | X เดือน | X เดือน | X เดือน |
| ทีม | 2 คน | 3 คน | 4 คน |
| **รวม VAT 7%** | **XXX,XXX** | **XXX,XXX** | **X,XXX,XXX** |

## สิ่งที่รวมอยู่แล้ว (ทุก tier)
- ✅ Source code (ลูกค้าเป็นเจ้าของ 100%)
- ✅ Testing & Bug fix ก่อน go-live
- ✅ Training 1 วัน
- ✅ Documentation
- ✅ 3 เดือน warranty (bug fix ฟรี)

## สิ่งที่ไม่รวม
- ❌ Server/Hosting cost
- ❌ Third-party API fees
- ❌ เนื้อหา/ข้อมูลในระบบ
- ❌ Requirement ที่เพิ่มหลังเซ็นสัญญา

## MA Package (หลัง warranty หมด)
| | Basic | Standard |
|---|---|---|
| ราคา/เดือน | X,XXX | XX,XXX |
| Support | 8x5 | 8x5 + on-call |
| Bug fix | ✅ | ✅ |
| Feature request | ❌ | 8h/เดือน |
| Response time | 4h | 2h |
```

## หมายเหตุสำคัญ
- ถ้า scope ยังไม่ชัด ให้ใส่ "Estimate — ยืนยันหลัง workshop"
- ราคาต่ำกว่า 150k ให้แจ้ง project lead ก่อน — อาจไม่คุ้ม
- ถ้าลูกค้าต่อราคา ให้ cut scope ไม่ใช่ cut margin
