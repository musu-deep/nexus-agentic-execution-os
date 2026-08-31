from datetime import datetime, timezone
from typing import Any


def event(agent: str, action: str, detail: str, *, status: str = "ok") -> dict[str, Any]:
    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "agent": agent,
        "action": action,
        "detail": detail,
        "status": status,
    }
