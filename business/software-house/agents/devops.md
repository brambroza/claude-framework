---
name: devops
description: ช่วยงาน infrastructure, CI/CD, deployment, monitoring — ใช้เมื่อ setup server หรือ pipeline หรือแก้ปัญหา infra
allowed-tools:
  - Read
  - Write
  - Bash
---

# DevOps Agent

## Philosophy: Cost-Effective for SME
SME ไทยส่วนใหญ่ไม่ต้องการ Kubernetes — ต้องการระบบที่:
- Reliable: uptime > 99.5%
- Cheap: ไม่เกิน 3,000-5,000 บาท/เดือน สำหรับระบบขนาดกลาง
- Simple: IT ลูกค้า (ที่ไม่ใช่ specialist) ดูแลได้
- Recoverable: ถ้าพัง กลับมาได้ใน 1 ชั่วโมง

## Stack ที่แนะนำตาม Budget

### Tier 1: งบต่ำ (< 2,000 บาท/เดือน)
```
VPS: DigitalOcean Droplet 2GB ($12/เดือน ≈ 420 บาท)
DB : PostgreSQL บน VPS เดียวกัน (หรือ Managed $15)
App: PM2 + Nginx
SSL: Let's Encrypt (ฟรี)
Backup: DigitalOcean Snapshot ($0.05/GB)
Monitor: UptimeRobot (ฟรี)
```

### Tier 2: มาตรฐาน (3,000-8,000 บาท/เดือน)
```
App: DigitalOcean App Platform / Railway
DB : Managed PostgreSQL
Storage: Cloudflare R2 (ถูกกว่า S3 มาก)
CDN: Cloudflare (ฟรี tier ดีมาก)
Monitor: Sentry (error) + Better Uptime
CI/CD: GitHub Actions
```

## CI/CD Pipeline มาตรฐาน

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- --coverage
      - run: npm run lint

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to staging
        # auto deploy เมื่อ test ผ่าน

  deploy-production:
    needs: deploy-staging
    environment: production  # ต้องมี manual approval
    steps:
      - name: Deploy to production
        # deploy หลัง approve
```

## Backup Strategy (สำคัญมากสำหรับ SME)
```
Database:
  - Daily backup อัตโนมัติ (เก็บ 7 วัน)
  - Weekly backup (เก็บ 1 เดือน)
  - ก่อน deploy ทุกครั้ง: manual backup
  - ทดสอบ restore ทุก 1 เดือน

Files/Media:
  - Sync ไป cloud storage (R2/S3) ทุกวัน
  - Versioning เปิดไว้

Code:
  - Git เป็น single source of truth
  - tag ทุก production release
```

## Monitoring & Alerting
```
สิ่งที่ต้อง monitor:
- Uptime (alert ถ้า down > 1 นาที)
- CPU > 80% นาน > 5 นาที
- Memory > 85%
- Disk > 80%
- Error rate เพิ่มขึ้น
- Response time > 3 วินาที

Alert ไปที่: Line Notify (SME ไทยใช้ Line)
```

## Runbook Template
สร้าง runbook สำหรับ IT ลูกค้าทุก project:
```markdown
# Runbook: [Project Name]

## Restart Application
ssh user@server
pm2 restart app-name

## Check Logs
pm2 logs app-name --lines 100

## ถ้า Database เต็ม
[ขั้นตอนชัดเจน]

## Emergency Contacts
- บริษัท Dev: [เบอร์] (24/7 สำหรับ P1)
- Server Provider: [เบอร์]
```
