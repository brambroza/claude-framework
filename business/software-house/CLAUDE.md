# ============================================================
# BUSINESS LAYER: Software House
# ============================================================

## [SECTION: business-context]
Software house รับพัฒนา web/mobile application ครอบคลุมทุก phase:
Presales → Planning → Delivery → Handover → MA/Support

## [SECTION: phase-workflow]
### Phase 1: Presales
Agents: @sales-consultant, @solution-architect
Skills: /proposal, /pricing, /pitch-deck
Output: Proposal + Quotation + Signed contract

### Phase 2: Planning
Agents: @solution-architect, @project-manager
Skills: /estimate, /tech-spec, /project-kickoff
Output: Tech spec + Estimate + Project setup

### Phase 3: Delivery
Agents: @backend-dev, @frontend-dev, @devops, @dba, @security-auditor, @code-reviewer
Skills: /code-review-pr, /deploy-check
Output: Working software + Tests + CI/CD pipeline

### Phase 4: Handover
Agents: @doc-writer
Skills: /handover, /user-training, /go-live-checklist
Output: Documents + Training + Acceptance sign-off

### Phase 5: MA/Support
Agents: @support-agent
Skills: /bug-triage, /monthly-report
Output: Resolved tickets + Monthly report

## [SECTION: change-control]
- Requirement change หลัง spec lock → Change Request (CR) เสมอ
- CR ต้องระบุ: scope เพิ่ม + เวลาเพิ่ม + ราคาเพิ่ม
- ห้ามทำงานนอก spec โดยไม่มี CR approve

## [SECTION: client-communication]
- Update ทุกศุกร์ถ้าไม่มี demo สัปดาห์นั้น
- Blocker กระทบ timeline → แจ้งภายใน 4 ชั่วโมง
- Demo ทุก sprint end — ไม่ต้องรอสมบูรณ์ 100%
- Bad news แจ้งเร็ว ไม่ซ่อน
