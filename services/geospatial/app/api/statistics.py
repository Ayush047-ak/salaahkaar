from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(prefix="/api/statistics", tags=["Statistics"])


class SpatialStatsRequest(BaseModel):
    project_id: str
    parcels: List[Dict[str, Any]]


@router.post("")
def calculate_statistics(req: SpatialStatsRequest):
    return JSONResponse(
        status_code=503,
        content={
            "error": "service_unavailable",
            "message": (
                "Spatial statistics require numpy/geopandas which exceed "
                "Vercel's 250 MB bundle limit. "
                "Deploy the full service to Railway/Render/Fly.io."
            ),
            "project_id": req.project_id,
            "total_parcels": len(req.parcels),
        },
    )
