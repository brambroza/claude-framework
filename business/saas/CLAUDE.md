# SaaS Business Context

## บริบทธุรกิจ
Software as a Service — subscription-based product, multi-tenant architecture

## Domain Knowledge
- MRR = Monthly Recurring Revenue
- ARR = Annual Recurring Revenue
- Churn = อัตราลูกค้าที่ cancel subscription
- MAU/DAU = Monthly/Daily Active Users
- Tenant = แต่ละ organization ที่ใช้ระบบ

## Critical Business Rules
- tenant isolation เด็ดขาด — ข้อมูลของ tenant A ต้องไม่รั่วไป tenant B
- feature flag สำหรับ rollout ทีละ % ของ users
- billing logic ต้อง accurate มาก — ผิดพลาดกระทบรายได้โดยตรง
- downtime กระทบทุก tenant — ต้องมี SLA และ incident plan

## Tech Priorities
- Multi-tenancy: row-level security หรือ schema-per-tenant
- Observability: logging, metrics, tracing ครบ
- Zero-downtime deployment
- Database migration ต้องรองรับ backward compatibility

## Compliance
- SOC 2 Type II (ถ้า B2B enterprise)
- GDPR / PDPA สำหรับ data privacy
- ต้องมี data export และ deletion ตาม right to erasure
