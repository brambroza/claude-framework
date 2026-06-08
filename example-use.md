ตัวอย่างระบบ pos ลูกค้า go 
1.
./scripts/add-client.sh pos-client software-house
# แก้ไข clients/pos-client/CLAUDE.md ใส่ข้อมูลลูกค้าจริง
./scripts/switch-context.sh software-house pos-client --org=goalong
cd ~/projects/pos-client
claude

2. 
ลูกค้า: GoAlong-Soft ธุรกิจ: ร้านสะดวกซื้อ
งบ: 250000 timeline: 7day ทีม: senior 1, mid 2

ต้องการระบบ POS + Stock + PO + บัญชีเบื้องต้น ครบในระบบเดียว

ขอให้ทำตามลำดับนี้:

1. @solution-architect วิเคราะห์และเสนอ architecture + tech stack ที่เหมาะกับ SME ไทย งบ server ไม่เกิน 3,000 บาท/เดือน พร้อม module diagram และ data model หลัก

2. /tech-spec สร้าง technical specification ครอบคลุม 4 modules:
   - POS: ขายหน้าเคาน์เตอร์, รับเงินสด/โอน/QR, ออกใบเสร็จ, ลด stock อัตโนมัติ
   - Stock: รับ-จ่ายสินค้า, นับสต็อก, แจ้งเตือนสินค้าใกล้หมด, ประวัติ movement
   - PO: สร้างใบสั่งซื้อ, approve workflow, รับของเข้า stock อัตโนมัติ
   - บัญชีเบื้องต้น: รายรับ-รายจ่าย, กำไรขาดทุนรายวัน/เดือน, ต้นทุนสินค้า

3. /estimate breakdown งานและเวลาตาม spec ด้านบน พร้อม timeline calendar

4. @frontend-dev สร้าง UX/UI spec และ wireframe outline สำหรับแต่ละ module — mobile-first, ภาษาไทย, เน้นใช้งานง่ายสำหรับ cashier และ พนักงานคลัง

5. /proposal สร้าง proposal ฉบับเต็ม พร้อมราคา 3 tier และ payment terms

6. /handover เตรียม outline ของ document ที่ต้องส่งมอบทั้งหมด:
   - User manual ภาษาไทย (cashier, stock, admin)
   - Admin guide
   - Tech documentation
   - Quick reference card แต่ละ role

บันทึกทุก architecture decision ลง MEMORY.md ด้วย


 