# NEXUS — Agentic Execution OS

> **From executive goals to verified execution — autonomously.**

NEXUS is a new hackathon build for **All Things Agentic Hackathon 2026**. It demonstrates a governed
multi-agent workflow that converts an institutional objective into an execution structure, parallel
evidence/risk reviews, an executive decision package, and a concise action brief.

## Hackathon fit

**Target track:** Fortified Enterprise Fleet

**Required stack covered:**
- Gemini 3.5+ (`gemini-3.5-flash` by default)
- Google GenAI SDK (`google-genai`)
- Google Cloud infrastructure: Cloud Run
- Production-ready async/persistence adapters: Pub/Sub + Firestore

The hackathon requires Gemini 3.5 or newer, at least one Google agent framework/SDK, and at least one
Google Cloud infrastructure service.

## What makes it agentic

NEXUS does not keep the user trapped in a chat loop. A mission is created once and then the fleet operates:
1. Strategy decomposes the objective.
2. Data and Risk agents run in parallel.
3. Executive reconciles their findings.
4. Communication produces the brief.
5. Every transition is persisted and auditable.

In Google Cloud mode, Pub/Sub separates mission creation from mission execution.

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000`.

### Demo mode
The default `.env.example` has `DEMO_MODE=true`, so the end-to-end workflow works without credentials.

### Gemini mode
Set:

```env
DEMO_MODE=false
GEMINI_API_KEY=YOUR_KEY
GEMINI_MODEL=gemini-3.5-flash
```

## Google Cloud deployment

Enable services:

```bash
gcloud services enable run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  firestore.googleapis.com \
  pubsub.googleapis.com
```

Create Artifact Registry:

```bash
gcloud artifacts repositories create nexus \
  --repository-format=docker \
  --location=us-central1
```

Deploy:

```bash
gcloud run deploy nexus-agentic-os \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DEMO_MODE=false,USE_FIRESTORE=true,USE_PUBSUB=true,GEMINI_MODEL=gemini-3.5-flash,GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
```

Store the Gemini key with Secret Manager for the final submission rather than placing it in the repository.

## Pub/Sub async setup

```bash
gcloud pubsub topics create nexus-missions
```

After Cloud Run is deployed, create a push subscription to:

```text
https://YOUR_CLOUD_RUN_URL/internal/pubsub/process
```

For a production submission, secure the push endpoint with authenticated Pub/Sub delivery and a dedicated
service account.

## Firestore

Create a Firestore database in Native mode, then set:

```env
USE_FIRESTORE=true
FIRESTORE_COLLECTION=nexus_missions
```

## API

- `GET /health`
- `GET /api/agents`
- `POST /api/missions`
- `GET /api/missions`
- `GET /api/missions/{mission_id}`
- `POST /internal/pubsub/process`

Example:

```bash
curl -X POST http://localhost:8000/api/missions \
  -H "Content-Type: application/json" \
  -d '{
    "objective":"Launch a professional training program in three cities within 30 days.",
    "deadline_days":30,
    "budget":300000,
    "context":{"cities":3}
  }'
```

## Repository map

```text
app/
  agents/engine.py        multi-agent orchestration
  services/store.py       Firestore / memory state
  services/pubsub.py      async mission dispatch
  services/audit.py       trace events
  main.py                 API + dashboard
web/index.html             live mission dashboard
docs/ARCHITECTURE.md       architecture diagram
docs/DEVPOST_SUBMISSION.md submission draft
docs/DEMO_SCRIPT.md        4-minute demo plan
```

## New-build disclosure

This codebase is a **new implementation created August 31, 2026 for the hackathon**. It does not reuse
code from an earlier product repository. The concept is informed by general prior experience with
institutional planning and executive operations systems.

## Submission checklist

- [ ] Create a new GitHub repository and push this code.
- [ ] Add Gemini API key through Secret Manager.
- [ ] Deploy to Cloud Run.
- [ ] Enable Firestore.
- [ ] Enable Pub/Sub push execution.
- [ ] Capture Cloud proof in the demo video.
- [ ] Record the 4-minute demo.
- [ ] Paste the architecture diagram and technical description into Devpost.
- [ ] Select **Fortified Enterprise Fleet**.
- [ ] If entering as an incorporated startup, review eligibility for the Startup Excellence prize.

## License
MIT
