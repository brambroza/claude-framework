---
name: deploy-check
description: ตรวจสอบความพร้อมก่อน deploy production — ใช้ก่อน release ทุกครั้ง
allowed-tools:
  - Bash
  - Read
context: fork
---

# Deploy Check Skill

## Pre-deploy Checklist

### 1. Tests
```bash
npm test -- --coverage
# ต้องผ่านทั้งหมด coverage >= 80%
```

### 2. Build
```bash
npm run build
# ต้อง build สำเร็จไม่มี error
```

### 3. Environment Variables
ตรวจว่า production env มีครบ:
```bash
# เปรียบเทียบ .env.example กับ production env
diff <(cat .env.example | grep -v '^#' | cut -d= -f1 | sort) \
     <(env | cut -d= -f1 | sort)
```

### 4. Database Migrations
```bash
# ดู pending migrations
npx prisma migrate status
# หรือ
npx sequelize db:migrate:status
```

### 5. Dependencies
```bash
npm audit --audit-level=high
# ถ้ามี high/critical vulnerability ต้องแก้ก่อน deploy
```

### 6. Docker / Container
```bash
docker build -t app:staging .
docker run --rm app:staging npm test
```

## Go / No-Go Decision

**🟢 GO** เมื่อ:
- Tests ผ่านทั้งหมด
- Build สำเร็จ
- ไม่มี critical security vulnerability
- Migrations พร้อม

**🔴 NO-GO** เมื่อ:
- มี failing test
- Build fail
- มี HIGH/CRITICAL vulnerability ที่ยังไม่แก้
- Missing required env variables

## Rollback Plan
ก่อน deploy production ต้องมี rollback plan:
1. snapshot database ล่าสุด
2. tag docker image ที่รัน production อยู่
3. ขั้นตอน rollback ใช้เวลากี่นาที
