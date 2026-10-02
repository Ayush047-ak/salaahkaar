from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.storage.file_storage import FileStorageManager
from app.api import health, ingest, preprocess, extract, geometry, reconcile, volumes, statistics

# Ensure storage directories exist
FileStorageManager.ensure_directories()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="High-performance spatial microservice for 3D point clouds, cadastre reconciliation, and topology checks."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(ingest.router)
app.include_router(preprocess.router)
app.include_router(extract.router)
app.include_router(geometry.router)
app.include_router(reconcile.router)
app.include_router(volumes.router)
app.include_router(statistics.router)

@app.get("/")
def root():
    return {
        "service": "Salaahkaar Geospatial Service",
        "docs_url": "/docs",
        "status": "online"
    }
