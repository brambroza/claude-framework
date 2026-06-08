# ============================================================
# ORG CONFIG TEMPLATE
# Layer: org (ระหว่าง core และ business)
# คัดลอกไปที่ org/[org-name]/CLAUDE.md แล้วแก้ไข
# ============================================================
# Layer hierarchy:
# core → org → business → client
# ============================================================

## [SECTION: org-identity]
- Organization: [ชื่อองค์กร]
- Industry: [เช่น Software House, Fintech, Healthcare]
- Primary Language: [ภาษาหลักที่ใช้สื่อสาร]
- Working Hours: [เช่น Mon-Fri 09:00-18:00 ICT]

## [SECTION: coding-standards][OVERRIDE]
# override จาก core ถ้าองค์กรมี standard ต่างออกไป
# ตัวอย่าง:
# - ใช้ ESLint config ของ org: @myorg/eslint-config
# - ใช้ Prettier config จาก shared package
# - naming convention: camelCase สำหรับ function, PascalCase สำหรับ class

## [SECTION: tech-defaults]
# tech stack ที่ org ใช้เป็น default
# Frontend: 
# Backend: 
# Database: 
# Infrastructure: 
# CI/CD: 
# Monitoring: 
# Communication: [Slack / Line / Teams]

## [SECTION: org-security]
# security policy เฉพาะองค์กร
# - MFA required สำหรับทุก service
# - code ผ่าน org security scanner ก่อน merge
# - third-party library ต้อง approve จาก tech lead ก่อนใช้

## [SECTION: compliance]
# กฎ compliance ที่องค์กรต้องปฏิบัติ
# - PDPA (พรบ. คุ้มครองข้อมูลส่วนบุคคล ไทย)
# - [เพิ่ม ISO / SOC2 / HIPAA ตามที่ใช้]

## [SECTION: escalation]
# ใครต้องอนุมัติอะไร
# - Architecture change: ต้องผ่าน CTO / Tech Lead
# - Production deploy: ต้องผ่าน Team Lead
# - New third-party service: ต้องผ่าน Security review
# - Database schema change: ต้องผ่าน DBA

## [SECTION: forbidden-actions][ADDITIONAL]
# เพิ่มเติมจาก core forbidden (ไม่ override — เพิ่มเติม)
# - ห้ามใช้ library ที่ไม่ได้อยู่ใน org-approved list โดยไม่ขออนุญาต
# - ห้าม access production database โดยตรงในเวลาทำการ
