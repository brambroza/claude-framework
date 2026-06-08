#!/bin/bash
# add-org.sh — สร้าง org layer ใหม่
# Usage: ./scripts/add-org.sh <org-id>
# Example: ./scripts/add-org.sh goalong

set -e

FRAMEWORK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ORG_ID=$1

if [ -z "$ORG_ID" ]; then
  echo "❌ Usage: $0 <org-id>"
  echo "Example: $0 goalong"
  exit 1
fi

ORG_DIR="$FRAMEWORK_DIR/org/$ORG_ID"

if [ -d "$ORG_DIR" ]; then
  echo "❌ Org '$ORG_ID' already exists at $ORG_DIR"
  exit 1
fi

echo "🏢 Creating org: $ORG_ID"

mkdir -p "$ORG_DIR/agents"
mkdir -p "$ORG_DIR/skills"

# Copy template
cp "$FRAMEWORK_DIR/org-template/CLAUDE.md" "$ORG_DIR/CLAUDE.md"
cp "$FRAMEWORK_DIR/org-template/agents/org-advisor.md" "$ORG_DIR/agents/org-advisor.md"

# Replace placeholder
sed -i '' "s/\[ชื่อองค์กร\]/$ORG_ID/g" "$ORG_DIR/CLAUDE.md" 2>/dev/null || \
sed -i "s/\[ชื่อองค์กร\]/$ORG_ID/g" "$ORG_DIR/CLAUDE.md"

echo ""
echo "✅ Org '$ORG_ID' created at: $ORG_DIR"
echo ""
echo "Next steps:"
echo "  1. แก้ไข $ORG_DIR/CLAUDE.md"
echo "  2. เพิ่ม agents ใน $ORG_DIR/agents/"
echo "  3. เพิ่ม skills ใน $ORG_DIR/skills/"
echo "  4. ใช้: ./scripts/switch-context.sh <business> [client] --org=$ORG_ID"
