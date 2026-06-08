#!/bin/bash
# setup.sh v2 — ติดตั้ง Claude Code Framework
# รองรับ: core, org, hooks, memory

set -e

FRAMEWORK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLAUDE_DIR="$HOME/.claude"

echo "🚀 Claude Code Framework v2.0 Setup"
echo "======================================"
echo "Framework: $FRAMEWORK_DIR"
echo "Claude dir: $CLAUDE_DIR"
echo ""

# สร้าง directories
mkdir -p "$CLAUDE_DIR/agents"
mkdir -p "$CLAUDE_DIR/skills"
mkdir -p "$CLAUDE_DIR/hooks"

# =====================
# Link Core Agents
# =====================
echo "📦 Installing core agents..."
for agent in "$FRAMEWORK_DIR/core/agents/"*.md; do
  [ -f "$agent" ] || continue
  name=$(basename "$agent")
  ln -sf "$agent" "$CLAUDE_DIR/agents/$name"
  echo "  ✓ $name"
done

# =====================
# Link Core Skills
# =====================
echo "📦 Installing core skills..."
for skill_dir in "$FRAMEWORK_DIR/core/skills/"/*/; do
  [ -d "$skill_dir" ] || continue
  name=$(basename "$skill_dir")
  ln -sf "$skill_dir" "$CLAUDE_DIR/skills/$name"
  echo "  ✓ $name"
done

# =====================
# Install Core Hooks
# =====================
echo "🔒 Installing hooks..."
for hook in "$FRAMEWORK_DIR/core/hooks/"*.py; do
  [ -f "$hook" ] || continue
  name=$(basename "$hook")
  ln -sf "$hook" "$CLAUDE_DIR/hooks/$name"
  chmod +x "$hook"
  echo "  ✓ $name"
done

# Copy hooks settings.json
if [ -f "$FRAMEWORK_DIR/core/hooks/settings.json" ]; then
  cp "$FRAMEWORK_DIR/core/hooks/settings.json" "$CLAUDE_DIR/settings.json"
  echo "  ✓ settings.json (hooks config)"
fi

# =====================
# Copy Base CLAUDE.md
# =====================
echo "📝 Setting up base CLAUDE.md..."
cp "$FRAMEWORK_DIR/core/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"
echo "  ✓ ~/.claude/CLAUDE.md"

echo ""
echo "✅ Core framework v2.0 installed!"
echo ""
echo "Next steps:"
echo "  1. (Optional) Setup org layer:"
echo "     cp -r org-template/ org/my-org/"
echo "     # แก้ไข org/my-org/CLAUDE.md"
echo ""
echo "  2. Switch context:"
echo "     ./scripts/switch-context.sh software-house [client-name]"
echo ""
echo "  3. ดู status:"
echo "     ./scripts/status.sh"
echo ""
echo "Available businesses:"
ls "$FRAMEWORK_DIR/business/"
