# ============================================================
# CLAUDE CODE FRAMEWORK — CORE LAYER v2.0
# Layer: core (ใช้กับทุก project และทุก business)
# Override: business/client layer เขียนทับได้
#           โดยใส่ [SECTION: ชื่อเดิม][OVERRIDE] ใน layer ถัดไป
# ============================================================

## [SECTION: language]
- ตอบเป็นภาษาไทยเมื่อถามภาษาไทย ตอบ EN เมื่อถาม EN
- อธิบาย reasoning ก่อนเริ่ม code เสมอ
- ถ้าไม่แน่ใจ requirement ให้ถามก่อน ห้ามสมมติเอง

## [SECTION: coding-standards]
- ใช้ TypeScript เป็น default สำหรับ JavaScript projects
- ทุก function ต้องมี JSDoc / docstring
- ตั้งชื่อตัวแปรและ function ให้สื่อความหมาย
- ห้าม hardcode secrets, API keys, หรือ credentials
- ทุก public API ต้องมี input validation

## [SECTION: git]
- commit message ต้องเป็น Conventional Commits: feat|fix|docs|refactor|test|chore
- ตัวอย่าง: `feat(auth): add JWT refresh token support`
- ห้าม commit ไฟล์ที่มี secret หรือ credential
- ห้าม push โดยไม่ขออนุญาต
- ห้าม force push บน main/master

## [SECTION: security]
- ตรวจ SQL injection, XSS, CSRF ทุกครั้งที่เขียน endpoint
- ใช้ parameterized queries เสมอ
- validate และ sanitize input ทุก field
- ใช้ HTTPS เสมอ

## [SECTION: testing]
- เขียน unit test ควบคู่กับ feature เสมอ
- coverage ต้องไม่ต่ำกว่า 80%
- ทดสอบ edge cases และ error scenarios ด้วย

## [SECTION: forbidden-actions]
# HARD LIMITS — ไม่มี layer ใด override ได้
- ห้ามลบไฟล์โดยไม่ขออนุญาต
- ห้าม run database migration โดยไม่แจ้งก่อน
- ห้าม deploy production โดยไม่ได้รับ approval
- ห้ามแก้ไข .env, docker-compose.prod.yml โดยไม่แจ้ง
- ห้าม rm -rf ทุกกรณี
- ห้ามเปิดเผย credentials ใน output หรือ log

## [SECTION: memory-protocol]
# Claude ต้องทำเพื่อให้ context ข้ามเซสชัน
- เมื่อเริ่ม session: อ่าน MEMORY.md ก่อน (ถ้ามี) แล้วบอกว่า "จำอะไรได้บ้าง"
- เมื่อมี decision สำคัญ (architecture, tech choice, business rule): บันทึกลง MEMORY.md
- เมื่อจบ session หรือถูกขอ: อัพเดต MEMORY.md ด้วย key learnings
- format: [YYYY-MM-DD] หัวข้อ — รายละเอียด — เหตุผล
