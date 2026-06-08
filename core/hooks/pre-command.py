#!/usr/bin/env python3
"""
pre-command.py — Claude Code Hook
ป้องกัน destructive commands ก่อน execute
ทำงานทุกครั้งที่ Claude จะรัน bash command
"""

import json
import sys
import re

# อ่าน hook input จาก stdin
try:
    hook_input = json.load(sys.stdin)
except Exception:
    sys.exit(0)  # ถ้าอ่านไม่ได้ ให้ผ่าน

command = hook_input.get("command", "")
tool_name = hook_input.get("tool_name", "")

# ============================================================
# HARD BLOCK — หยุดทันที ไม่ว่ากรณีใด
# ============================================================
HARD_BLOCK = [
    (r"\brm\s+-rf\b", "ห้าม rm -rf เด็ดขาด"),
    (r"\brm\s+--recursive\b", "ห้าม rm --recursive"),
    (r"git\s+push\s+--force\b(?!\s*-with-lease)", "ห้าม git push --force (ใช้ --force-with-lease แทน)"),
    (r"DROP\s+TABLE\b", "ห้าม DROP TABLE โดยไม่ได้รับ approval"),
    (r"DROP\s+DATABASE\b", "ห้าม DROP DATABASE"),
    (r"TRUNCATE\s+TABLE\b", "ห้าม TRUNCATE TABLE โดยไม่ขออนุญาต"),
    (r"kubectl\s+delete\s+namespace\b", "ห้าม kubectl delete namespace"),
    (r"chmod\s+777\b", "ห้าม chmod 777 — ใช้ permission ที่เฉพาะเจาะจงกว่านี้"),
    (r"curl\b.*\|\s*(bash|sh)\b", "ห้าม pipe curl ไปยัง shell โดยตรง"),
]

# ============================================================
# WARN — แจ้งเตือนและขอ confirmation
# ============================================================
WARN_PATTERNS = [
    (r"git\s+push\s+.*\b(main|master|production)\b", "⚠️  กำลัง push ไป main/master/production"),
    (r"\bnpm\s+publish\b", "⚠️  กำลัง publish package ไป npm"),
    (r"terraform\s+apply\b", "⚠️  กำลัง apply Terraform changes"),
    (r"kubectl\s+apply\b.*production", "⚠️  กำลัง apply ไป production cluster"),
    (r"docker\s+push\b.*:latest", "⚠️  กำลัง push Docker image tag :latest"),
    (r"prisma\s+migrate\s+deploy\b", "⚠️  กำลัง run database migration"),
    (r"sequelize\s+db:migrate\b(?!\s*:undo)", "⚠️  กำลัง run database migration"),
]

if tool_name in ("Bash", "computer_use"):
    # ตรวจ HARD BLOCK
    for pattern, reason in HARD_BLOCK:
        if re.search(pattern, command, re.IGNORECASE):
            output = {
                "action": "block",
                "message": f"🚫 BLOCKED: {reason}\nCommand: {command[:200]}"
            }
            print(json.dumps(output))
            sys.exit(1)

    # ตรวจ WARN
    for pattern, reason in WARN_PATTERNS:
        if re.search(pattern, command, re.IGNORECASE):
            output = {
                "action": "warn",
                "message": f"{reason}\nCommand: {command[:200]}\n\nพิมพ์ 'yes' เพื่อยืนยัน หรือ 'no' เพื่อยกเลิก"
            }
            print(json.dumps(output))
            sys.exit(0)

# ผ่านทั้งหมด
sys.exit(0)
