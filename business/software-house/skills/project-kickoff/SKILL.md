---
name: project-kickoff
description: เตรียม project structure และ boilerplate สำหรับ project ใหม่ — ใช้เมื่อเริ่ม project ใหม่กับลูกค้า
allowed-tools:
  - Write
  - Bash
  - Read
context: fork
---

# Project Kickoff Skill

## สิ่งที่ทำเมื่อ invoke

1. ถามข้อมูล project (ถ้ายังไม่มี):
   - ชื่อ project และ client
   - tech stack ที่ใช้
   - team size
   - target launch date

2. สร้างโครงสร้างต่อไปนี้:

### README.md template
```markdown
# [Project Name]
> [One-line description]

## Quick Start
\`\`\`bash
git clone [repo]
cd [project]
cp .env.example .env
npm install
npm run dev
\`\`\`

## Tech Stack
- Frontend: ...
- Backend: ...
- Database: ...

## Development
...

## Deployment
...

## Team
...
```

### .claude/CLAUDE.md สำหรับ project
```markdown
# [Project Name] — Claude Config

## Project Context
- Client: [ชื่อลูกค้า]
- Tech Stack: [stack]
- Repository: [URL]
- Staging: [URL]
- Production: [URL]

## Rules เฉพาะ project นี้
- ...
```

### .github/PULL_REQUEST_TEMPLATE.md
```markdown
## What changed
[อธิบาย]

## Why
[business reason]

## Testing
- [ ] Unit tests pass
- [ ] Manual testing on staging
- [ ] No console errors

## Screenshots (if UI change)
```

3. สร้าง initial folder structure ตาม tech stack ที่เลือก

4. สรุป next steps ให้ developer
