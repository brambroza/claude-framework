---
name: feature-flag
description: จัดการ feature flags สำหรับ gradual rollout และ A/B testing — ใช้เมื่อต้องการ deploy feature แบบควบคุม
allowed-tools:
  - Read
  - Write
context: fork
---

# Feature Flag Skill

## วิธีใช้ Feature Flags

### 1. ประเภท flags
- **Release flag** — เปิด/ปิด feature ระหว่าง rollout
- **Experiment flag** — A/B test ระหว่าง 2 variants
- **Ops flag** — emergency kill switch สำหรับ performance issues
- **Permission flag** — เปิดเฉพาะ plan tier หรือ user group

### 2. Rollout Strategy
```
0% → 1% internal users → 5% beta → 25% → 50% → 100%
```
รอ monitor metrics ระหว่างแต่ละ step อย่างน้อย 24h

### 3. Naming Convention
```
[team].[feature].[variant]
example: payments.new-checkout.enabled
         billing.annual-discount.percentage
```

### 4. Cleanup
- flag ที่ rollout 100% แล้ว ต้องลบภายใน 2 sprints
- document วันที่สร้าง และ owner ทุก flag
- ห้ามมี flag ค้างนานกว่า 3 เดือน

## Output
สร้าง implementation plan พร้อม:
- flag definition
- rollout schedule
- success metrics
- rollback criteria
