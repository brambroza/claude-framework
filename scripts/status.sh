#!/bin/bash
# status.sh v2 — ดู context และ health ของ framework

CLAUDE_DIR="$HOME/.claude"
CONTEXT_FILE="$CLAUDE_DIR/.current-context"

echo "📊 Claude Code Framework v2.0 — Status"
echo "========================================"

# Current context
if [ -f "$CONTEXT_FILE" ]; then
  source "$CONTEXT_FILE"
  echo "🌍 Context"
  echo "  Org      : ${ORG:-—}"
  echo "  Business : ${BUSINESS:-—}"
  echo "  Client   : ${CLIENT:-—}"
  echo "  Switched : ${SWITCHED_AT:-—}"
else
  echo "⚠️  ยังไม่ได้ switch context — ใช้ core เท่านั้น"
fi

echo ""
echo "🤖 Active Agents ($(ls $CLAUDE_DIR/agents/ 2>/dev/null | wc -l | tr -d ' ')):"
ls "$CLAUDE_DIR/agents/" 2>/dev/null | sed 's/^/  /' | sed 's/.md$//'

echo ""
echo "🔧 Active Skills ($(ls $CLAUDE_DIR/skills/ 2>/dev/null | wc -l | tr -d ' ')):"
ls "$CLAUDE_DIR/skills/" 2>/dev/null | sed 's/^/  /'

echo ""
echo "🔒 Active Hooks ($(ls $CLAUDE_DIR/hooks/*.py 2>/dev/null | wc -l | tr -d ' ')):"
ls "$CLAUDE_DIR/hooks/"*.py 2>/dev/null | xargs -I{} basename {} | sed 's/^/  /'

echo ""
echo "🧠 Memory:"
if [ -f "$CLAUDE_DIR/MEMORY.md" ]; then
  lines=$(wc -l < "$CLAUDE_DIR/MEMORY.md")
  echo "  MEMORY.md linked ($lines lines)"
else
  echo "  ไม่มี MEMORY.md — Claude จะไม่จำ context ข้ามเซสชัน"
fi

echo ""
echo "📝 CLAUDE.md: $(wc -l < $CLAUDE_DIR/CLAUDE.md 2>/dev/null || echo 0) lines"

echo ""
echo "⚡ Quick Commands:"
echo "  Switch context : ./scripts/switch-context.sh <business> [client] [--org=name]"
echo "  Add client     : ./scripts/add-client.sh <client-id> <business>"
echo "  Re-setup       : ./scripts/setup.sh"
