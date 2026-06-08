#!/bin/bash
# switch-context.sh v2 — สลับ context 4 layers: core → org → business → client
# Usage: ./scripts/switch-context.sh <business> [client] [--org=org-name]
# Example: ./scripts/switch-context.sh software-house client-a --org=goalong

set -e

FRAMEWORK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLAUDE_DIR="$HOME/.claude"

# Parse arguments
BUSINESS=""
CLIENT=""
ORG=""

for arg in "$@"; do
  if [[ "$arg" == --org=* ]]; then
    ORG="${arg#--org=}"
  elif [ -z "$BUSINESS" ]; then
    BUSINESS="$arg"
  elif [ -z "$CLIENT" ]; then
    CLIENT="$arg"
  fi
done

# =====================
# Validation
# =====================
if [ -z "$BUSINESS" ]; then
  echo "❌ Usage: $0 <business> [client] [--org=org-name]"
  echo ""
  echo "Available businesses:"
  ls "$FRAMEWORK_DIR/business/"
  exit 1
fi

if [ ! -d "$FRAMEWORK_DIR/business/$BUSINESS" ]; then
  echo "❌ Business '$BUSINESS' not found"
  ls "$FRAMEWORK_DIR/business/"
  exit 1
fi

if [ -n "$CLIENT" ] && [ ! -d "$FRAMEWORK_DIR/clients/$CLIENT" ]; then
  echo "❌ Client '$CLIENT' not found"
  ls "$FRAMEWORK_DIR/clients/"
  exit 1
fi

if [ -n "$ORG" ] && [ ! -d "$FRAMEWORK_DIR/org/$ORG" ]; then
  echo "⚠️  Org '$ORG' not found at org/$ORG — skipping org layer"
  ORG=""
fi

echo "🔄 Switching context (v2 — 4 layers)..."
echo "  Core     : ✓ (always)"
echo "  Org      : ${ORG:-— (skipped)}"
echo "  Business : $BUSINESS"
echo "  Client   : ${CLIENT:-— (skipped)}"
echo ""

# =====================
# Merge CLAUDE.md (4 layers)
# =====================
echo "📝 Merging CLAUDE.md..."

cat "$FRAMEWORK_DIR/core/CLAUDE.md" > "$CLAUDE_DIR/CLAUDE.md"

# Org layer
if [ -n "$ORG" ] && [ -f "$FRAMEWORK_DIR/org/$ORG/CLAUDE.md" ]; then
  printf "\n\n# ==============================\n# ORG LAYER: %s\n# ==============================\n" "$ORG" >> "$CLAUDE_DIR/CLAUDE.md"
  cat "$FRAMEWORK_DIR/org/$ORG/CLAUDE.md" >> "$CLAUDE_DIR/CLAUDE.md"
  echo "  ✓ org/$ORG"
fi

# Business layer
if [ -f "$FRAMEWORK_DIR/business/$BUSINESS/CLAUDE.md" ]; then
  printf "\n\n# ==============================\n# BUSINESS LAYER: %s\n# ==============================\n" "$BUSINESS" >> "$CLAUDE_DIR/CLAUDE.md"
  cat "$FRAMEWORK_DIR/business/$BUSINESS/CLAUDE.md" >> "$CLAUDE_DIR/CLAUDE.md"
  echo "  ✓ business/$BUSINESS"
fi

# Client layer
if [ -n "$CLIENT" ] && [ -f "$FRAMEWORK_DIR/clients/$CLIENT/CLAUDE.md" ]; then
  printf "\n\n# ==============================\n# CLIENT LAYER: %s\n# ==============================\n" "$CLIENT" >> "$CLAUDE_DIR/CLAUDE.md"
  cat "$FRAMEWORK_DIR/clients/$CLIENT/CLAUDE.md" >> "$CLAUDE_DIR/CLAUDE.md"
  echo "  ✓ client/$CLIENT"
fi

# =====================
# Link Agents (core + org + business)
# =====================
echo "🤖 Installing agents..."

# ลบ non-core agents เก่า
for f in "$CLAUDE_DIR/agents/"*.md; do
  [ -f "$f" ] || continue
  target=$(readlink "$f" 2>/dev/null || echo "")
  if [[ "$target" == *"/business/"* ]] || [[ "$target" == *"/org/"* ]]; then
    rm -f "$f"
  fi
done

# org agents
if [ -n "$ORG" ] && [ -d "$FRAMEWORK_DIR/org/$ORG/agents" ]; then
  for agent in "$FRAMEWORK_DIR/org/$ORG/agents/"*.md; do
    [ -f "$agent" ] || continue
    name=$(basename "$agent")
    ln -sf "$agent" "$CLAUDE_DIR/agents/org-${name}"
    echo "  ✓ org: $name"
  done
fi

# business agents
if [ -d "$FRAMEWORK_DIR/business/$BUSINESS/agents" ]; then
  for agent in "$FRAMEWORK_DIR/business/$BUSINESS/agents/"*.md; do
    [ -f "$agent" ] || continue
    name=$(basename "$agent")
    ln -sf "$agent" "$CLAUDE_DIR/agents/$name"
    echo "  ✓ $name"
  done
fi

# =====================
# Link Skills (core + org + business)
# =====================
echo "🔧 Installing skills..."

# ลบ non-core skills เก่า
for d in "$CLAUDE_DIR/skills/"/*/; do
  [ -d "$d" ] || continue
  target=$(readlink "${d%/}" 2>/dev/null || echo "")
  if [[ "$target" == *"/business/"* ]] || [[ "$target" == *"/org/"* ]]; then
    rm -f "${d%/}"
  fi
done

# org skills
if [ -n "$ORG" ] && [ -d "$FRAMEWORK_DIR/org/$ORG/skills" ]; then
  for skill_dir in "$FRAMEWORK_DIR/org/$ORG/skills/"/*/; do
    [ -d "$skill_dir" ] || continue
    name=$(basename "$skill_dir")
    ln -sf "$skill_dir" "$CLAUDE_DIR/skills/org-${name}"
    echo "  ✓ org: $name"
  done
fi

# business skills
if [ -d "$FRAMEWORK_DIR/business/$BUSINESS/skills" ]; then
  for skill_dir in "$FRAMEWORK_DIR/business/$BUSINESS/skills/"/*/; do
    [ -d "$skill_dir" ] || continue
    name=$(basename "$skill_dir")
    ln -sf "$skill_dir" "$CLAUDE_DIR/skills/$name"
    echo "  ✓ $name"
  done
fi

# =====================
# Install Business Hooks
# =====================
if [ -d "$FRAMEWORK_DIR/business/$BUSINESS/hooks" ]; then
  echo "🔒 Installing business hooks..."
  for hook in "$FRAMEWORK_DIR/business/$BUSINESS/hooks/"*.py; do
    [ -f "$hook" ] || continue
    name=$(basename "$hook")
    ln -sf "$hook" "$CLAUDE_DIR/hooks/$name"
    chmod +x "$hook"
    echo "  ✓ $name"
  done
fi

# =====================
# Setup Memory
# =====================
if [ -n "$CLIENT" ]; then
  MEMORY_SRC="$FRAMEWORK_DIR/clients/$CLIENT/memory/MEMORY.md"
  MEMORY_LINK="$CLAUDE_DIR/MEMORY.md"
  if [ -f "$MEMORY_SRC" ]; then
    ln -sf "$MEMORY_SRC" "$MEMORY_LINK"
    echo "🧠 Memory linked: clients/$CLIENT/memory/MEMORY.md"
  fi
fi

# =====================
# Save context
# =====================
cat > "$CLAUDE_DIR/.current-context" << EOF
BUSINESS=$BUSINESS
CLIENT=$CLIENT
ORG=$ORG
SWITCHED_AT=$(date '+%Y-%m-%d %H:%M:%S')
EOF

echo ""
echo "✅ Switched: ${ORG:+$ORG / }$BUSINESS${CLIENT:+ / $CLIENT}"
echo ""
echo "Active agents : $(ls "$CLAUDE_DIR/agents/" | wc -l | tr -d ' ')"
echo "Active skills : $(ls "$CLAUDE_DIR/skills/" | wc -l | tr -d ' ')"
echo "CLAUDE.md     : $(wc -l < "$CLAUDE_DIR/CLAUDE.md") lines"
