# NEXUS Architecture

```mermaid
flowchart TD
    U[Executive Objective] --> API[Cloud Run API]
    API --> S[(Firestore Mission State)]
    API --> Q[Pub/Sub Mission Topic]
    Q --> O[Orchestrator]
    O --> A1[Strategy Agent]
    A1 --> P{Parallel Review}
    P --> A2[Data Agent]
    P --> A3[Risk Agent]
    A2 --> A4[Executive Agent]
    A3 --> A4
    A4 --> A5[Communication Agent]
    A5 --> S
    O --> T[Audit / Observability Events]
    G[Gemini 3.5+ via Google GenAI SDK] --- A1
    G --- A2
    G --- A3
    G --- A4
    G --- A5
```

## Agent fleet

| Agent | Job | Primary control |
|---|---|---|
| Strategy | Decompose objective | explicit assumptions + decision gates |
| Data | Test evidence and constraints | uncertainty disclosure |
| Risk | Challenge the plan | early-warning signals + mitigations |
| Executive | Reconcile into decision | confidence + escalation rules |
| Communication | Issue concise brief | factual compression |

## Async pattern

For local demos, the API dispatches the mission as an in-process task. For Google Cloud deployment,
`USE_PUBSUB=true` changes dispatch to Pub/Sub. A push subscription calls `/internal/pubsub/process`,
which executes the mission independently of the original user request.

## Persistence

`USE_FIRESTORE=true` persists mission state, outputs, and audit events across requests and restarts.
The memory adapter remains available for zero-setup local evaluation.

## Governance

NEXUS exposes a minimal agent registry with purpose and permissions. Every material state transition adds
an audit event. The design intentionally separates mission input, specialist analysis, executive synthesis,
and outward communication so each step can be inspected.
