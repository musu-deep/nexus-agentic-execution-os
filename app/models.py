from datetime import datetime, timezone
from typing import Any, Literal
from uuid import uuid4

from pydantic import BaseModel, Field


class MissionCreate(BaseModel):
    objective: str = Field(min_length=8)
    deadline_days: int = Field(default=30, ge=1, le=365)
    budget: float = Field(default=300000, ge=0)
    context: dict[str, Any] = Field(default_factory=dict)


class Mission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    objective: str
    deadline_days: int
    budget: float
    context: dict[str, Any] = Field(default_factory=dict)
    status: Literal["queued", "planning", "executing", "completed", "failed"] = "queued"
    current_stage: str = "Queued"
    agents: list[dict[str, Any]] = Field(default_factory=list)
    result: dict[str, Any] = Field(default_factory=dict)
    audit: list[dict[str, Any]] = Field(default_factory=list)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
