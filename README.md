# NEXUS — Autonomous Organization Operating System

> **Agentic execution infrastructure for strategy, governance, decisions, and organizational operations.**

NEXUS is a new build created for the **All Things Agentic Hackathon 2026**. It converts an organizational objective into coordinated, traceable execution through a governed fleet of specialized AI agents.

The deployed application combines **NEXUS Organization Studio** with a multi-agent execution runtime powered by **Gemini 3.7 Flash through Vertex AI**, using the **Google GenAI SDK** and **Google Cloud Run**.

## Track

**Fortified Enterprise Fleet**

## Deployed stack

- Gemini 3.7 Flash
- Vertex AI
- Google GenAI SDK (`google-genai`)
- Google Cloud Run
- Python / FastAPI
- React / TypeScript / Vite
- Docker multi-stage build

Firestore and Pub/Sub adapters exist in the codebase as future persistence and asynchronous-execution extensions, but they are **not enabled in the current submitted deployment**.

## Agent fleet

1. **Strategy Agent** — decomposes the objective into workstreams, milestones, assumptions, dependencies, and decision gates.
2. **Data Agent** — evaluates evidence, operating constraints, budget controls, uncertainty, and missing information.
3. **Risk Agent** — challenges schedule, financial, dependency, governance, and compliance exposure.
4. **Executive Agent** — reconciles specialist outputs into a decision-ready execution package.
5. **Communication Agent** — converts the executive package into a concise action brief.
6. **Orchestrator** — manages sequencing, state transitions, and audit events across the mission lifecycle.

## Reproducible local testing

### 1. Clone the repository

```bash
git clone https://github.com/musu-deep/nexus-agentic-execution-os.git
cd nexus-agentic-execution-os
```

### 2. Create a Python environment

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Run in credential-free demo mode

```bash
export DEMO_MODE=true
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open:

```text
http://127.0.0.1:8000
```

Health check:

```bash
curl http://127.0.0.1:8000/health
```

### 4. Create a test mission

```bash
curl -X POST http://127.0.0.1:8000/api/missions \
  -H "Content-Type: application/json" \
  -d '{
    "objective":"Develop a 30-day recovery plan for an organization with delayed strategic projects, rising operating costs, and weak cross-department coordination.",
    "deadline_days":30,
    "budget":250000,
    "context":{"priority":"execution recovery"}
  }'
```

Use the returned mission `id` with:

```bash
curl http://127.0.0.1:8000/api/missions/MISSION_ID
```

## Reproducible Google Cloud deployment

### Prerequisites

- Google Cloud project with billing enabled
- `gcloud` authenticated and configured
- Cloud Run and Vertex AI APIs enabled
- Cloud Run runtime service account granted `roles/aiplatform.user`

Enable required APIs:

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com aiplatform.googleapis.com
```

Deploy from the repository root:

```bash
gcloud run deploy nexus-agentic-os \
  --source . \
  --region me-central1 \
  --allow-unauthenticated \
  --set-env-vars DEMO_MODE=false,USE_VERTEX_AI=true,GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID,GOOGLE_CLOUD_LOCATION=global,GEMINI_MODEL=gemini-3.7-flash,USE_FIRESTORE=false,USE_PUBSUB=false
```

The Dockerfile builds the React Organization Studio and packages it with the FastAPI runtime into one Cloud Run service.

## Hosted application

https://nexus-agentic-os-u6risnpasa-ww.a.run.app

Useful verification endpoint:

```text
https://nexus-agentic-os-u6risnpasa-ww.a.run.app/health
```

The deployed health response identifies the active frontend, Gemini model, Vertex AI backend, and enabled infrastructure features.

## API

- `GET /health`
- `GET /api/agents`
- `POST /api/missions`
- `GET /api/missions`
- `GET /api/missions/{mission_id}`
- `POST /internal/pubsub/process`

## Repository structure

```text
app/
  agents/engine.py             multi-agent orchestration
  services/store.py            memory / optional Firestore adapter
  services/pubsub.py           optional asynchronous dispatch adapter
  services/audit.py            mission audit events
  main.py                      API + Organization Studio delivery

organization-studio/
  src/                         React / TypeScript institutional interface
  docs/                        integration and migration notes

docs/
  ARCHITECTURE.md              system architecture
  DEVPOST_SUBMISSION.md        submission draft
  DEMO_SCRIPT.md               demo structure
```

## New-build disclosure

This repository is a **new implementation created on August 31, 2026 for the hackathon**. The submitted NEXUS agent runtime, multi-agent architecture, generalized Organization Studio, Google Cloud deployment, and integration were developed specifically for this project.

## License

MIT
