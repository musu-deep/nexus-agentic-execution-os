# 4-minute Demo Script

## 0:00–0:25 — The problem
"Organizations already have dashboards and chatbots. The missing layer is autonomous execution:
turning a goal into coordinated work, challenging it with evidence and risk, and returning a traceable decision."

## 0:25–0:50 — Architecture
Show `docs/ARCHITECTURE.md`.
Highlight Gemini 3.5+, Google GenAI SDK, Cloud Run, Pub/Sub, Firestore, five specialist agents, and audit events.

## 0:50–1:15 — Launch mission
Open the NEXUS dashboard and submit:
"Launch a professional training program in three cities within 30 days while keeping total spending
under the approved budget."

## 1:15–2:30 — Watch autonomous execution
Show:
- Strategy Agent creates workstreams and decision gates.
- Data Agent and Risk Agent run in parallel.
- Executive Agent reconciles their findings.
- Communication Agent issues the brief.
- Audit panel records each transition.

Do not type another prompt. This is the core agentic moment.

## 2:30–3:05 — Async Cloud proof
Show Google Cloud:
- Cloud Run service
- Pub/Sub topic/subscription
- Firestore mission document
Explain that the original web request only creates the mission; Pub/Sub triggers independent processing.

## 3:05–3:35 — Governance
Show `/api/agents` or the five agent cards.
Explain purpose, permissions, persistent mission state, and traceability.

## 3:35–4:00 — Close
"NEXUS is not a chatbot for institutions. It is an execution layer: from goals to verified execution."
