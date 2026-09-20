import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from db.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print("[ContextLock Zero] SQLite Database initialized.")
    yield

app = FastAPI(
    title="ContextLock Zero API",
    description="AI Decision Immune System - Protects project decisions against hidden contradictions, churn, and drift.",
    version="1.0.0",
    lifespan=lifespan
)

# Parse allowed CORS origins from environment
raw_origins = os.environ.get("ALLOWED_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()] if raw_origins != "*" else ["*"]

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach routes
app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {
        "name": "ContextLock Zero",
        "pitch": "Git tracks code. ContextLock Zero protects project decisions.",
        "status": "online",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8000"))
    reload = os.environ.get("RELOAD", "false").lower() == "true"
    uvicorn.run("main:app", host=host, port=port, reload=reload)
