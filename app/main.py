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
STUDIO_DIR = BASE_DIR / "organization-studio-dist"
LEGACY_WEB_DIR = BASE_DIR / "web"

app = FastAPI(
    title=settings.app_name,
    version="0.2.0-hackathon",
    description="Autonomous institutional execution using a governed multi-agent fleet.",
)

if (STUDIO_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=STUDIO_DIR / "assets"), name="studio-assets")
elif LEGACY_WEB_DIR.exists():
    app.mount("/static", StaticFiles(directory=LEGACY_WEB_DIR), name="legacy-static")


def frontend_index() -> FileResponse:
    studio_index = STUDIO_DIR / "index.html"
    if studio_index.exists():
        return FileResponse(studio_index)
    return FileResponse(LEGACY_WEB_DIR / "index.html")


@app.get("/")
def home():
    return frontend_index()


@app.get("/health")
def health():
    return {
        "status": "ok",
        "app": settings.app_name,
        "frontend": "organization-studio" if (STUDIO_DIR / "index.html").exists() else "legacy-web",
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


@app.get("/{full_path:path}", include_in_schema=False)
def studio_spa(full_path: str):
    if full_path.startswith(("api/", "internal/")) or full_path == "health":
        raise HTTPException(status_code=404, detail="Not found")

    if STUDIO_DIR.exists():
        requested = (STUDIO_DIR / full_path).resolve()
        try:
            requested.relative_to(STUDIO_DIR.resolve())
        except ValueError:
            raise HTTPException(status_code=404, detail="Not found")
        if requested.is_file():
            return FileResponse(requested)
        return frontend_index()

    legacy_file = (LEGACY_WEB_DIR / full_path).resolve()
    try:
        legacy_file.relative_to(LEGACY_WEB_DIR.resolve())
    except ValueError:
        raise HTTPException(status_code=404, detail="Not found")
    if legacy_file.is_file():
        return FileResponse(legacy_file)
    return frontend_index()
