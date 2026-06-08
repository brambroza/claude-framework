---
name: onboard
description: แนะนำ developer ใหม่เกี่ยวกับ project setup, agents, skills, และ workflow — ใช้เมื่อเริ่มทำงานกับ project ใหม่
allowed-tools:
  - Read
  - Bash
context: fork
---

# Onboard Skill

เมื่อถูก invoke ให้ทำตามขั้นตอนนี้:

## Step 1: อ่าน context ทั้งหมด
```bash
# อ่าน CLAUDE.md ที่ merge แล้ว
cat ~/.claude/CLAUDE.md

# อ่าน project MEMORY (ถ้ามี)
cat MEMORY.md 2>/dev/null || echo "ยังไม่มี MEMORY.md"

# ดู agents ที่ active
ls ~/.claude/agents/

# ดู skills ที่ active  
ls ~/.claude/skills/

# ดู project structure
ls -la
```

## Step 2: สรุปให้ developer ใหม่รู้

สร้างรายงาน onboarding ที่ครอบคลุม:

### 🏢 Project Overview
- ชื่อ project และ business context
- tech stack ที่ใช้
- team size และ structure

### 🤖 Agents ที่ใช้ได้
| Agent | ใช้เมื่อ | เรียกด้วย |
|---|---|---|
| (list จาก ~/.claude/agents/) | | @agent-name |

### 🔧 Skills ที่ใช้ได้
| Skill | ทำอะไร | เรียกด้วย |
|---|---|---|
| (list จาก ~/.claude/skills/) | | /skill-name |

### 📋 Rules สำคัญ
- สรุป 5 ข้อที่สำคัญที่สุดจาก CLAUDE.md
- สิ่งที่ห้ามทำ (forbidden-actions)

### 🚀 First Steps
1. ทดลองรัน project: `[command]`
2. ดู open issues: `[link]`
3. อ่าน MEMORY.md สำหรับ context สำคัญ

### 💬 Quick Reference
```
# เรียก code review
@code-reviewer ช่วย review ไฟล์นี้

# เริ่ม project ใหม่
/project-kickoff

# ตรวจก่อน deploy
/deploy-check

# ดู framework status
./scripts/status.sh
```

### ⚠️ สิ่งที่ต้องระวัง
- (ดึงจาก MEMORY.md section "Gotchas & Warnings")

## Step 3: ถามว่าต้องการ deep dive ส่วนไหน
