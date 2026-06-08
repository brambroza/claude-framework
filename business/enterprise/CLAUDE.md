# Enterprise Business Context

## บริบทธุรกิจ
Enterprise software — ระบบขนาดใหญ่ หลายแผนก compliance สูง

## Domain Knowledge
- BRD = Business Requirements Document
- UAT = User Acceptance Testing
- Change Management = กระบวนการอนุมัติการเปลี่ยนแปลง
- SLA = Service Level Agreement
- DR = Disaster Recovery

## Critical Rules
- ทุก change ต้องผ่าน Change Advisory Board (CAB) ก่อน production
- ต้องมี rollback plan ที่ทดสอบแล้วก่อน deploy
- audit log ทุก action ที่กระทบข้อมูล sensitive
- downtime ต้องแจ้ง stakeholder ล่วงหน้าอย่างน้อย 48h (ยกเว้น emergency)

## Compliance
- ISO 27001 / SOC 2
- PDPA / GDPR
- ข้อมูล sensitive ต้อง encrypt at rest และ in transit
- data retention policy ตามที่กำหนด

## Communication
- รายงาน executive ต้องกระชับ ไม่เกิน 1 หน้า
- technical details ไปใน appendix
- ใช้ business language ไม่ใช่ technical jargon เมื่อคุยกับ C-level
