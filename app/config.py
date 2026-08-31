from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "NEXUS — Agentic Execution OS"

    gemini_api_key: str | None = None
    gemini_model: str = "gemini-3.7-flash"
    use_vertex_ai: bool = False
    google_cloud_project: str | None = None
    google_cloud_location: str = "global"

    demo_mode: bool = True

    use_firestore: bool = False
    firestore_collection: str = "nexus_missions"

    use_pubsub: bool = False
    pubsub_topic: str = "nexus-missions"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
