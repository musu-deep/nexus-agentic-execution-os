import asyncio
import json
from typing import Any

from app.config import settings
from app.services.audit import event
from app.services.store import store


AGENT_REGISTRY = [
    {
        "id": "strategy",
        "name": "Strategy Agent",
        "purpose": "Translate a broad executive objective into measurable workstreams and decision criteria.",
        "permissions": ["mission:read", "plan:write"],
    },
    {
        "id": "data",
        "name": "Data Agent",
        "purpose": "Inspect operational context and produce evidence, assumptions, and constraints.",
        "permissions": ["mission:read", "data:read", "analysis:write"],
    },
    {
        "id": "risk",
        "name": "Risk Agent",
        "purpose": "Detect delivery, budget, compliance, dependency, and timing risks.",
        "permissions": ["mission:read", "risk:write"],
    },
    {
        "id": "executive",
        "name": "Executive Agent",
        "purpose": "Reconcile plans, evidence, and risks into a decision-ready execution package.",
        "permissions": ["mission:read", "decision:write"],
    },
    {
        "id": "communications",
        "name": "Communication Agent",
        "purpose": "Create a crisp executive brief and next-action message.",
        "permissions": ["mission:read", "brief:write"],
    },
]


class AgentEngine:
    def __init__(self) -> None:
        self.client = None
        self.backend = "demo"

        if settings.demo_mode:
            return

        from google import genai

        if settings.use_vertex_ai:
            if not settings.google_cloud_project:
                raise RuntimeError("GOOGLE_CLOUD_PROJECT is required when USE_VERTEX_AI=true.")
            self.client = genai.Client(
                vertexai=True,
                project=settings.google_cloud_project,
                location=settings.google_cloud_location,
            )
            self.backend = "vertex-ai"
            return

        if settings.gemini_api_key:
            self.client = genai.Client(api_key=settings.gemini_api_key)
            self.backend = "gemini-api-key"
            return

        raise RuntimeError(
            "No Gemini backend configured. Set USE_VERTEX_AI=true or provide GEMINI_API_KEY."
        )

    def _model_call(self, role: str, prompt: str, mission: dict[str, Any]) -> str:
        if self.client is None:
            return self._demo_response(role, mission)

        response = self.client.models.generate_content(
            model=settings.gemini_model,
            contents=prompt,
        )
        return response.text or ""

    async def _ask(self, role: str, prompt: str, mission: dict[str, Any]) -> str:
        return await asyncio.to_thread(self._model_call, role, prompt, mission)

    def _demo_response(self, role: str, mission: dict[str, Any]) -> str:
        objective = mission["objective"]
        budget = mission["budget"]
        days = mission["deadline_days"]

        demo = {
            "strategy": (
                f"Objective decomposed into 4 workstreams for '{objective}': "
                f"scope & owners, delivery calendar, budget controls, launch readiness. "
                f"Primary constraint: {days}-day deadline. Decision gates at days 3, 10, 20 and 27."
            ),
            "data": (
                f"Evidence scan: budget ceiling {budget:,.0f}. Recommend reserving 12% contingency, "
                "tracking planned vs. committed spend daily, and using a shared dependency register. "
                "Assumption: three-city delivery requires parallel vendor and venue workstreams."
            ),
            "risk": (
                "Top risks: venue confirmation delay (high), supplier lead-time variance (medium-high), "
                "budget leakage from late procurement (medium), fragmented ownership (medium). "
                "Mitigations: decision SLA, capped purchase approvals, fallback venues, and owner-level escalation."
            ),
            "executive": (
                "Decision: proceed with a controlled parallel launch. Approve a 12% contingency reserve, "
                "appoint one accountable owner per city, lock venue/vendor decisions by day 7, "
                "and escalate any critical-path slippage above 48 hours. Confidence: 0.86."
            ),
            "communications": (
                "Executive brief: mission approved for controlled execution. Four workstreams are active; "
                "the highest exposure is venue/vendor timing. Next checkpoint: confirm owners, budget envelopes, "
                "and city readiness evidence before the first decision gate."
            ),
        }
        return demo[role]

    async def run(self, mission_id: str) -> None:
        mission = store.get(mission_id)
        if not mission:
            return

        try:
            mission["status"] = "planning"
            mission["current_stage"] = "Strategy decomposition"
            mission["agents"] = AGENT_REGISTRY
            mission["audit"].append(event("orchestrator", "mission_started", "Mission moved from queue to planning."))
            store.put(mission)

            strategy_prompt = f"""
You are the Strategy Agent in NEXUS, an institutional execution operating system.
Mission: {mission["objective"]}
Deadline: {mission["deadline_days"]} days
Budget: {mission["budget"]}
Context: {json.dumps(mission["context"], ensure_ascii=False)}
Produce a concise execution decomposition: workstreams, owners-as-roles, milestones, decision gates,
success measures, dependencies, and explicit assumptions. No motivational prose.
"""
            strategy = await self._ask("strategy", strategy_prompt, mission)
            mission["result"]["strategy"] = strategy
            mission["audit"].append(event("strategy", "plan_created", "Execution structure and decision gates generated."))
            mission["status"] = "executing"
            mission["current_stage"] = "Parallel evidence & risk review"
            store.put(mission)

            data_prompt = f"""
You are the Data Agent. Assess the evidence and operational constraints for this mission.
Mission: {mission["objective"]}
Budget: {mission["budget"]}
Deadline: {mission["deadline_days"]} days
Strategy draft: {strategy}
Context: {json.dumps(mission["context"], ensure_ascii=False)}
Return evidence, assumptions, budget controls, missing data, and measurable signals. Flag uncertainty.
"""
            risk_prompt = f"""
You are the Risk Agent. Challenge the execution plan for this mission.
Mission: {mission["objective"]}
Strategy draft: {strategy}
Identify the most material schedule, budget, governance, dependency, and compliance risks.
For each critical risk provide an early warning signal and a concrete mitigation.
"""
            data_result, risk_result = await asyncio.gather(
                self._ask("data", data_prompt, mission),
                self._ask("risk", risk_prompt, mission),
            )
            mission["result"]["data"] = data_result
            mission["result"]["risk"] = risk_result
            mission["audit"].append(event("data", "evidence_reviewed", "Evidence and operating assumptions reviewed."))
            mission["audit"].append(event("risk", "risk_reviewed", "Critical-path and control risks reviewed."))
            mission["current_stage"] = "Executive synthesis"
            store.put(mission)

            executive_prompt = f"""
You are the Executive Agent. Reconcile the following into a decision-ready execution package.
Mission: {mission["objective"]}
Strategy: {strategy}
Data review: {data_result}
Risk review: {risk_result}

Return: decision, rationale, priority actions, escalation rules, next checkpoint, and confidence from 0 to 1.
Do not hide uncertainty or invent evidence.
"""
            executive = await self._ask("executive", executive_prompt, mission)
            mission["result"]["executive"] = executive
            mission["audit"].append(event("executive", "decision_issued", "Execution decision package issued."))
            mission["current_stage"] = "Executive communication"
            store.put(mission)

            comms_prompt = f"""
You are the Communication Agent. Convert this executive package into a five-line executive brief
that states decision, current status, top risk, next action, and next checkpoint.
Executive package: {executive}
"""
            comms = await self._ask("communications", comms_prompt, mission)
            mission["result"]["brief"] = comms
            mission["status"] = "completed"
            mission["current_stage"] = "Completed"
            mission["audit"].append(event("communications", "brief_created", "Executive brief generated."))
            mission["audit"].append(event("orchestrator", "mission_completed", "Mission completed with traceable agent actions."))
            store.put(mission)

        except Exception as exc:
            latest = store.get(mission_id) or mission
            latest["status"] = "failed"
            latest["current_stage"] = "Failed"
            latest["audit"].append(event("orchestrator", "mission_failed", str(exc), status="error"))
            store.put(latest)


engine = AgentEngine()
