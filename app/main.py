import asyncio
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.agents.engine import AGENT_REGISTRY, engine
from app.config import settings
from app.models import Mission, MissionCreate
from app.services.pubsub import decode_push_envelope, publish_mission
from app.services.store import store

BASE_DIR = Path(__file__).resolve().parent.parent

app = FastAPI(
    title=settings.app_name,
    version="0.1.0-hackathon",
    description="Autonomous institutional execution using a governed multi-agent fleet.",
)

app.mount("/static", StaticFiles(directory=BASE_DIR / "web"), name="static")


@app.get("/")
def home():
    return FileResponse(BASE_DIR / "web" / "index.html")


@app.get("/health")
def health():
    return {
        "status": "ok",
        "app": settings.app_name,
        "model": settings.gemini_model,
        "backend": engine.backend,
        "demo_mode": settings.demo_mode,
        "vertex_ai": settings.use_vertex_ai,
        "location": settings.google_cloud_location if settings.use_vertex_ai else None,
        "firestore": settings.use_firestore,
        "pubsub": settings.use_pubsub,
    }


@app.get("/api/agents")
def agents():
    return {"agents": AGENT_REGISTRY}


@app.post("/api/missions", response_model=Mission)
async def create_mission(payload: MissionCreate):
    mission = Mission(**payload.model_dump())
    store.put(mission.model_dump())

    if settings.use_pubsub:
        publish_mission(mission.id)
    else:
        asyncio.create_task(engine.run(mission.id))

    return mission


@app.get("/api/missions")
def list_missions():
    return {"missions": store.list()}


@app.get("/api/missions/{mission_id}")
def get_mission(mission_id: str):
    mission = store.get(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission


@app.post("/internal/pubsub/process")
async def process_pubsub(request: Request):
    envelope = await request.json()
    mission_id = decode_push_envelope(envelope)
    await engine.run(mission_id)
    return {"ok": True, "mission_id": mission_id}
