# Claude Code Framework v2.0
> Multi-org, multi-business, multi-client framework สำหรับ Claude Code
> พร้อม memory, hooks, และ section-based override system

## Architecture (4 Layers)

```
core          →  org          →  business       →  client
(ทุก project)    (ทุก project      (domain-specific)  (เฉพาะลูกค้า)
                 ในองค์กรนี้)
```

## โครงสร้าง

```
claude-framework/
├── core/                        ← shared ทุก project
│   ├── CLAUDE.md                ← base rules (section-based)
│   ├── agents/                  ← code-reviewer, security-auditor, doc-writer
│   ├── skills/                  ← git-workflow, code-review, deploy-check, onboard
│   └── hooks/                   ← pre-command.py, post-session.py, settings.json
│
├── org-template/                ← template สำหรับสร้าง org ใหม่
├── org/                         ← สร้างด้วย add-org.sh
│   └── [org-name]/
│       ├── CLAUDE.md
│       ├── agents/
│       └── skills/
│
├── business/                    ← context เฉพาะธุรกิจ
│   ├── software-house/
│   │   ├── CLAUDE.md
│   │   ├── agents/              ← project-manager, tech-architect
│   │   ├── skills/              ← project-kickoff, tech-spec, code-review-pr
│   │   └── hooks/               ← client-context-guard.py
│   ├── ecommerce/
│   ├── saas/
│   └── enterprise/
│
├── clients/                     ← สร้างด้วย add-client.sh
│   └── [client-id]/
│       ├── CLAUDE.md            ← section-based override
│       ├── .env.claude          ← gitignored
│       └── memory/
│           └── MEMORY.md        ← persistent memory ข้ามเซสชัน
│
├── CHANGELOG.md                 ← track framework changes
└── scripts/
    ├── setup.sh                 ← ติดตั้งครั้งแรก
    ├── switch-context.sh        ← สลับ context (4 layers)
    ├── add-org.sh               ← สร้าง org ใหม่
    ├── add-client.sh            ← สร้าง client ใหม่
    └── status.sh                ← ดู status ปัจจุบัน
```

## Quick Start

### 1. Clone และ setup
```bash
git clone git@github.com:your-org/claude-framework.git
cd claude-framework
chmod +x scripts/*.sh
./scripts/setup.sh
```

### 2. สร้าง org (ครั้งเดียวต่อองค์กร)
```bash
./scripts/add-org.sh goalong
# แก้ไข org/goalong/CLAUDE.md
```

### 3. สร้าง client ใหม่
```bash
./scripts/add-client.sh acme-corp software-house
# แก้ไข clients/acme-corp/CLAUDE.md
# แก้ไข clients/acme-corp/memory/MEMORY.md
```

### 4. Switch context ก่อนทำงาน
```bash
./scripts/switch-context.sh software-house acme-corp --org=goalong
```

### 5. ดู status
```bash
./scripts/status.sh
```

---

## Section-Based Override System

Layer ถัดไปสามารถ override section จาก layer ก่อนได้:

```markdown
## [SECTION: coding-standards][OVERRIDE]
# เนื้อหาใหม่แทนที่ core section ทั้งหมด
- ใช้ JavaScript ไม่ใช่ TypeScript
```

หรือเพิ่มเติมโดยไม่ override:
```markdown
## [SECTION: forbidden-actions][ADDITIONAL]
# เพิ่มเข้าไปในรายการห้าม ไม่แทนที่
- ห้ามใช้ library ที่ไม่ได้ approve
```

---

## Memory System

Claude จะจำ context ข้ามเซสชันผ่าน `MEMORY.md`:
- **อ่านอัตโนมัติ** เมื่อเริ่ม session
- **บันทึกอัตโนมัติ** ผ่าน post-session hook
- **แก้ไขได้เอง** — เพิ่ม/ลบ entries ได้ตลอด

```bash
# บอก Claude ให้อัพเดต memory
"บันทึกลง MEMORY.md ว่าเราตัดสินใจใช้ Redis สำหรับ session"
```

---

## Hooks

| Hook | ทำงานเมื่อ | ป้องกันอะไร |
|---|---|---|
| `pre-command.py` | ก่อนรัน Bash | rm -rf, force push, DROP TABLE |
| `post-session.py` | หลังรัน Bash | auto-update MEMORY.md |
| `client-context-guard.py` | ก่อนรัน Bash | cross-client data leak |

---

## Agents & Skills

### Core Agents
| Agent | ใช้เมื่อ |
|---|---|
| `@code-reviewer` | review code ก่อน merge |
| `@security-auditor` | OWASP security scan |
| `@doc-writer` | เขียน README, API docs |

### Core Skills
| Skill | Command | ทำอะไร |
|---|---|---|
| git-workflow | `/git-workflow` | branch, commit, PR guide |
| code-review | `/code-review` | full code review |
| deploy-check | `/deploy-check` | pre-deploy checklist |
| onboard | `/onboard` | developer ใหม่ทำความเข้าใจ project |

### Software House Agents
| Agent | ใช้เมื่อ |
|---|---|
| `@project-manager` | sprint planning, task breakdown |
| `@tech-architect` | system design, ADR |

### Software House Skills
| Skill | Command | ทำอะไร |
|---|---|---|
| project-kickoff | `/project-kickoff` | setup project ใหม่ |
| tech-spec | `/tech-spec` | เขียน technical spec |
| code-review-pr | `/code-review-pr` | review PR อย่างละเอียด |

---

## .gitignore
```
clients/*/.env.claude
clients/*/.env
*.local
.env*
!.env.example
org/*/secrets/
```
