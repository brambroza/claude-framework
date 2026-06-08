#!/bin/bash
# add-client.sh v2 — สร้าง client ใหม่พร้อม MEMORY.md
# Usage: ./scripts/add-client.sh <client-id> <business-type>

set -e

FRAMEWORK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLIENT_ID=$1
BUSINESS=$2

if [ -z "$CLIENT_ID" ] || [ -z "$BUSINESS" ]; then
  echo "❌ Usage: $0 <client-id> <business-type>"
  echo "Example: $0 acme-corp software-house"
  exit 1
fi

CLIENT_DIR="$FRAMEWORK_DIR/clients/$CLIENT_ID"

if [ -d "$CLIENT_DIR" ]; then
  echo "❌ Client '$CLIENT_ID' already exists"
  exit 1
fi

echo "➕ Creating client: $CLIENT_ID (type: $BUSINESS)"
TODAY=$(date +%Y-%m-%d)

mkdir -p "$CLIENT_DIR/memory"

# CLAUDE.md
cat > "$CLIENT_DIR/CLAUDE.md" << EOF
# ============================================================
# CLIENT LAYER: $CLIENT_ID
# Business Type: $BUSINESS
# Created: $TODAY
# ============================================================

## [SECTION: org-identity][OVERRIDE]
- Client: $CLIENT_ID
- Project: [ชื่อ project]
- Business Type: $BUSINESS
- Project Lead: [ชื่อ]
- Start Date: $TODAY
- Target Launch: [วันที่]

## [SECTION: tech-defaults][OVERRIDE]
# override เฉพาะถ้า client ใช้ stack ต่างจาก org/business default
# Frontend: 
# Backend: 
# Database: 
# Repository: 
# Staging URL: 
# Production URL: 

## [SECTION: client-rules]
# rules เฉพาะ client นี้
# ตัวอย่าง:
# - ใช้ JavaScript ไม่ใช่ TypeScript (client request)
# - deploy ได้เฉพาะวันพฤหัส 20:00-22:00

## [SECTION: contacts]
- Technical Lead (client): [ชื่อ + อีเมล]
- Project Sponsor: [ชื่อ]
- Channel: [Slack / Line / Email]
- Sprint Review: [วันในสัปดาห์]
- Deploy Window: [เช่น วันพุธ 22:00-24:00]
EOF

# .env.claude
cat > "$CLIENT_DIR/.env.claude" << EOF
# $CLIENT_ID — Environment Context (gitignored)
STAGING_API_URL=
PRODUCTION_API_URL=
CLIENT_TIMEZONE=Asia/Bangkok
CLIENT_LANGUAGE=th
CLIENT_CURRENCY=THB
EOF

# MEMORY.md
cat > "$CLIENT_DIR/memory/MEMORY.md" << EOF
# Project Memory — $CLIENT_ID
# Created: $TODAY
# Claude อ่านไฟล์นี้ทุกครั้งที่เริ่ม session
# ============================================================

## Project Overview
- [${TODAY}] Project: $CLIENT_ID — [คำอธิบายสั้น]
- Tech Stack: [stack]
- Team: [จำนวนคน]

## Architecture Decisions
# [YYYY-MM-DD] decision — เหตุผล

## Recurring Issues & Solutions
# [YYYY-MM-DD] ปัญหา — วิธีแก้

## Business Rules Learned
# [YYYY-MM-DD] กฎที่ค้นพบ

## Gotchas & Warnings
# [YYYY-MM-DD] สิ่งที่ต้องระวัง

## Pending Decisions
# - [ ] สิ่งที่ยังต้องตัดสินใจ
EOF

echo ""
echo "✅ Client '$CLIENT_ID' created:"
echo "  📁 $CLIENT_DIR/"
echo "  📝 CLAUDE.md"
echo "  🔐 .env.claude (gitignored)"
echo "  🧠 memory/MEMORY.md"
echo ""
echo "Next steps:"
echo "  1. แก้ไข $CLIENT_DIR/CLAUDE.md"
echo "  2. รัน: ./scripts/switch-context.sh $BUSINESS $CLIENT_ID"
