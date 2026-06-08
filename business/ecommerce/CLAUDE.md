# E-commerce Business Context

## บริบทธุรกิจ
ระบบ e-commerce — จัดการสินค้า คำสั่งซื้อ การชำระเงิน และ logistics

## Domain Knowledge
- SKU = Stock Keeping Unit (รหัสสินค้าเฉพาะ)
- Inventory = จำนวนสินค้าคงคลัง
- Fulfillment = กระบวนการ pack และ ship สินค้า
- CAC = Customer Acquisition Cost
- AOV = Average Order Value
- LTV = Lifetime Value

## Critical Business Rules
- ห้ามให้สินค้าติดลบ (negative inventory) เด็ดขาด
- payment transaction ต้อง idempotent (กันการตัดเงินซ้ำ)
- order status ต้องมี audit trail ทุก transition
- ราคาที่แสดงต้อง consistent ระหว่าง cart และ checkout

## Tech Priorities
- Performance สำคัญมาก — product listing ต้องโหลด < 1s
- ใช้ cache อย่างระมัดระวัง (ราคา, stock อาจเปลี่ยนบ่อย)
- payment integration ต้องมี webhook retry mechanism

## Compliance
- เก็บข้อมูลบัตรเครดิตต้องผ่าน PCI DSS compliant gateway
- ข้อมูลลูกค้าต้องเก็บตาม PDPA (ไทย) หรือ GDPR (EU)
