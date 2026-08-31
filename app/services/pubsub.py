import base64
import json
from typing import Any

from app.config import settings


def publish_mission(mission_id: str) -> str | None:
    if not settings.use_pubsub:
        return None

    from google.cloud import pubsub_v1

    if not settings.google_cloud_project:
        raise RuntimeError("GOOGLE_CLOUD_PROJECT is required when USE_PUBSUB=true.")

    publisher = pubsub_v1.PublisherClient()
    topic_path = publisher.topic_path(settings.google_cloud_project, settings.pubsub_topic)
    payload = json.dumps({"mission_id": mission_id}).encode("utf-8")
    return publisher.publish(topic_path, payload).result(timeout=30)


def decode_push_envelope(envelope: dict[str, Any]) -> str:
    message = envelope.get("message", {})
    encoded = message.get("data")
    if not encoded:
        raise ValueError("Pub/Sub push envelope is missing message.data")
    payload = json.loads(base64.b64decode(encoded).decode("utf-8"))
    mission_id = payload.get("mission_id")
    if not mission_id:
        raise ValueError("Pub/Sub payload is missing mission_id")
    return mission_id
