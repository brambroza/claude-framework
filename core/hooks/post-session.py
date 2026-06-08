#!/usr/bin/env python3
"""
post-session.py — Claude Code Hook
บันทึก key decisions ลง MEMORY.md อัตโนมัติหลังแต่ละ session
"""

import json
import sys
import os
from datetime import datetime

try:
    hook_input = json.load(sys.stdin)
except Exception:
    sys.exit(0)

# ตรวจว่ามี decision ที่ควรบันทึกใน session นี้ไหม
# (Claude จะส่ง memory_entries มาถ้ามีสิ่งที่ควรจำ)
memory_entries = hook_input.get("memory_entries", [])
project_root = hook_input.get("cwd", os.getcwd())
memory_file = os.path.join(project_root, "MEMORY.md")

if not memory_entries:
    sys.exit(0)

today = datetime.now().strftime("%Y-%m-%d")

# สร้างหรือ append MEMORY.md
existing = ""
if os.path.exists(memory_file):
    with open(memory_file, "r") as f:
        existing = f.read()

new_entries = f"\n## {today}\n"
for entry in memory_entries:
    new_entries += f"- {entry}\n"

if existing:
    content = existing + new_entries
else:
    content = f"""# Project Memory
# Claude อ่านไฟล์นี้ทุกครั้งที่เริ่ม session เพื่อ restore context
# แก้ไขได้โดยตรง หรือบอก Claude ให้อัพเดต
# ============================================================
{new_entries}"""

with open(memory_file, "w") as f:
    f.write(content)

print(json.dumps({"message": f"✅ MEMORY.md updated ({len(memory_entries)} entries)"}))
sys.exit(0)
