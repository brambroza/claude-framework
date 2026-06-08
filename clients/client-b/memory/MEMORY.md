# Project Memory
# Claude อ่านไฟล์นี้ทุกครั้งที่เริ่ม session เพื่อ restore context
# แก้ไขได้โดยตรง หรือบอก Claude ให้อัพเดต
# ============================================================
# Format: [YYYY-MM-DD] หัวข้อ — รายละเอียด — เหตุผล
# ============================================================

## Project Overview
- [วันที่เริ่ม] Project: [ชื่อ] — [คำอธิบายสั้น]
- Tech Stack: [stack ที่ใช้]
- Team: [จำนวนคน / role]

## Architecture Decisions
# บันทึก ADR สำคัญที่ตัดสินใจแล้ว
# ตัวอย่าง:
# [2025-06-01] ใช้ PostgreSQL ไม่ใช่ MongoDB — data มี relation ซับซ้อน, ต้องการ ACID
# [2025-06-05] ใช้ Redis สำหรับ session — ลด DB load, TTL จัดการง่าย

## Recurring Issues & Solutions
# ปัญหาที่เจอซ้ำๆ และวิธีแก้
# ตัวอย่าง:
# [2025-06-10] CORS error กับ Safari — ต้องเพิ่ม credentials: 'include' ฝั่ง frontend ด้วย

## Business Rules Learned
# กฎ business ที่ค้นพบระหว่างทำงาน
# ตัวอย่าง:
# [2025-06-08] ราคาสินค้า include VAT เสมอ — ลูกค้ายืนยัน ห้ามแสดง ex-VAT

## Gotchas & Warnings
# สิ่งที่ต้องระวัง
# ตัวอย่าง:
# [2025-06-12] อย่า migrate production วันศุกร์บ่าย — เคยมีปัญหา rollback ช่วงวันหยุด

## Dependencies & Integrations
# third-party ที่ใช้และข้อควรระวัง
# ตัวอย่าง:
# [2025-06-03] Omise webhook ต้อง verify signature เสมอ — มี retry logic อยู่แล้ว

## Pending Decisions
# สิ่งที่ยังต้องตัดสินใจ
# - [ ] เลือก message queue: RabbitMQ vs BullMQ
# - [ ] กำหนด data retention policy
