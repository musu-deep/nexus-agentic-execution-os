from copy import deepcopy
from datetime import datetime, timezone
from threading import Lock
from typing import Any

from app.config import settings

_MEMORY: dict[str, dict[str, Any]] = {}
_LOCK = Lock()


class MissionStore:
    def __init__(self) -> None:
        self._firestore = None
        if settings.use_firestore:
            from google.cloud import firestore
            self._firestore = firestore.Client(project=settings.google_cloud_project)

    def put(self, mission: dict[str, Any]) -> None:
        mission["updated_at"] = datetime.now(timezone.utc).isoformat()
        if self._firestore:
            self._firestore.collection(settings.firestore_collection).document(mission["id"]).set(mission)
            return
        with _LOCK:
            _MEMORY[mission["id"]] = deepcopy(mission)

    def get(self, mission_id: str) -> dict[str, Any] | None:
        if self._firestore:
            snap = self._firestore.collection(settings.firestore_collection).document(mission_id).get()
            return snap.to_dict() if snap.exists else None
        with _LOCK:
            value = _MEMORY.get(mission_id)
            return deepcopy(value) if value else None

    def list(self) -> list[dict[str, Any]]:
        if self._firestore:
            docs = self._firestore.collection(settings.firestore_collection).order_by(
                "created_at", direction="DESCENDING"
            ).limit(30).stream()
            return [doc.to_dict() for doc in docs]
        with _LOCK:
            return sorted(
                (deepcopy(x) for x in _MEMORY.values()),
                key=lambda x: x["created_at"],
                reverse=True,
            )


store = MissionStore()
