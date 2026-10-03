from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(prefix="/api/volumes", tags=["Volumes"])


class VolumeGenerationRequest(BaseModel):
    parcel_id: str
    footprint: List[List[float]]
    base_elevation: float = 0.0
    height: float
    floors: int = 1


@router.post("")
def generate_volume(req: VolumeGenerationRequest):
    return JSONResponse(
        status_code=503,
        content={
            "error": "service_unavailable",
            "message": (
                "Volume generation requires trimesh/shapely/numpy which exceed "
                "Vercel's 250 MB bundle limit. "
                "Deploy the full service to Railway/Render/Fly.io."
            ),
            "parcel_id": req.parcel_id,
        },
    )
