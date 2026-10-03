"""
Geospatial Service — Vercel-compatible stub.

Heavy processing (scipy / rasterio / geopandas / laspy / trimesh) exceeds
Vercel's 250 MB serverless limit.  This stub keeps the same API surface so
the frontend and Express API can deploy without changes; every endpoint
returns a 503 with a clear message telling callers to hit the real service.

The full implementation lives in git history (tag: full-geospatial-impl) and
should be hosted on Railway / Render / Fly.io, then wired up via the
GEOSPATIAL_SERVICE_URL env variable.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, ingest, preprocess, extract, geometry, reconcile, volumes, statistics

app = FastAPI(
    title="Salaahkaar Geospatial Service",
    version="0.1.0",
    description=(
        "Geospatial processing microservice. "
        "This Vercel deployment is a lightweight stub — heavy endpoints "
        "return 503 until the full service is hosted on a container platform."
    ),
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
        "mode": "stub",
        "docs_url": "/docs",
        "status": "online",
        "note": (
            "Running in stub mode on Vercel. "
            "Heavy geospatial processing is unavailable here; "
            "deploy the full service to Railway/Render/Fly.io."
        ),
    }
