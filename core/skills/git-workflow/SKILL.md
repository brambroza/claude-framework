---
name: git-workflow
description: จัดการ git workflow อย่างถูกต้อง — branch naming, commit, PR, merge — ใช้เมื่อต้องการช่วยด้าน git
allowed-tools:
  - Bash
  - Read
---

# Git Workflow Skill

## Branch Naming Convention
- Feature: `feat/TICKET-ID-short-description`
- Bug fix: `fix/TICKET-ID-short-description`
- Hotfix: `hotfix/TICKET-ID-short-description`
- Release: `release/v1.2.3`
- ตัวอย่าง: `feat/APP-123-user-authentication`

## Commit Message Format (Conventional Commits)
```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

Types: feat | fix | docs | style | refactor | test | chore | perf | ci

ตัวอย่าง:
```
feat(auth): add JWT refresh token rotation

- ใช้ sliding window สำหรับ refresh token
- expire เก่าเมื่อใช้แล้ว ป้องกัน token theft
- เพิ่ม redis cache สำหรับ blacklist

Closes #APP-123
```

## Workflow Steps

### เริ่ม feature ใหม่
```bash
git checkout main && git pull
git checkout -b feat/TICKET-short-desc
```

### ก่อน commit ทุกครั้ง
```bash
git status                    # ดูไฟล์ที่เปลี่ยน
git diff                      # ดูเนื้อหาที่เปลี่ยน
git add -p                    # เลือก staged แบบ interactive
```

### ก่อน push
```bash
git log --oneline -5          # ตรวจ commit history
git diff main...HEAD          # ดู diff ทั้งหมดจาก main
```

### สร้าง PR
- Title: เหมือน commit message แรก
- Description: What / Why / How / Testing done / Screenshots

## กฎเหล็ก
- ห้าม commit โดยตรงที่ main
- ห้าม `git push --force` บน shared branch
- ห้าม commit ไฟล์ที่มี secret (ตรวจด้วย `git diff --staged`)
- squash commit ก่อน merge ถ้า commit มากกว่า 5 อัน
