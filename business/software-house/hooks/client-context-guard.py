#!/usr/bin/env python3
"""
client-context-guard.py — Software House Hook
ป้องกัน cross-client data leak
ตรวจสอบว่า Claude ไม่เอาข้อมูล client หนึ่งไปใช้กับอีก client
"""

import json
import sys
import os
import re

try:
    hook_input = json.load(sys.stdin)
except Exception:
    sys.exit(0)

# อ่าน current context
context_file = os.path.expanduser("~/.claude/.current-context")
current_client = ""
if os.path.exists(context_file):
    with open(context_file) as f:
        for line in f:
            if line.startswith("CLIENT="):
                current_client = line.split("=", 1)[1].strip()

if not current_client:
    sys.exit(0)

tool_input = hook_input.get("tool_input", {})
command = tool_input.get("command", "") or tool_input.get("content", "")

# ตรวจว่า command พยายามเข้าถึง client อื่น
clients_dir = os.path.expanduser("~/claude-framework/clients/")
if os.path.exists(clients_dir):
    other_clients = [
        d for d in os.listdir(clients_dir)
        if os.path.isdir(os.path.join(clients_dir, d))
        and d != current_client
        and d not in (".", "..")
    ]
    
    for other in other_clients:
        if other in command and "clients/" in command:
            output = {
                "action": "block",
                "message": (
                    f"🚫 BLOCKED: พบการเข้าถึงข้อมูลของ client '{other}' "
                    f"แต่ context ปัจจุบันคือ '{current_client}'\n"
                    f"ถ้าต้องการสลับ client: ./scripts/switch-context.sh <business> {other}"
                )
            }
            print(json.dumps(output))
            sys.exit(1)

sys.exit(0)
