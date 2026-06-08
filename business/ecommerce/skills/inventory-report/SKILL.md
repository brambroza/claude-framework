---
name: inventory-report
description: สร้างรายงาน inventory, low stock alerts, และ sales analysis — ใช้เมื่อต้องการดูสถานะสินค้า
allowed-tools:
  - Bash
  - Read
context: fork
---

# Inventory Report Skill

## รายงานที่สร้างได้

### 1. Stock Summary
- สินค้าทั้งหมด / มีสต็อก / หมดสต็อก
- มูลค่า inventory รวม

### 2. Low Stock Alert
- สินค้าที่เหลือต่ำกว่า threshold
- แนะนำจำนวนที่ควรสั่ง (reorder point)

### 3. Slow Moving Items
- สินค้าที่ไม่ได้ขายเกิน 30/60/90 วัน
- แนะนำ promotion หรือ clearance

### 4. Sales Velocity
- จำนวนขายต่อวัน/สัปดาห์/เดือน
- forecast stock out date

## Output Format
สรุปเป็น Markdown table + executive summary
