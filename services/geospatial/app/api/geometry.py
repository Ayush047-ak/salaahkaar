from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api/geometry", tags=["Geometry"])


class MeshGenRequest(BaseModel):
    parcel_id: str
    coordinates: List[List[float]]
    height_m: float = 9.0


@router.post("/mesh")
def generate_mesh(req: MeshGenRequest):
    return JSONResponse(
        status_code=503,
        content={
            "error": "service_unavailable",
            "message": (
                "3D mesh generation requires shapely/trimesh which exceed "
                "Vercel's 250 MB bundle limit. "
                "Deploy the full service to Railway/Render/Fly.io."
            ),
            "parcel_id": req.parcel_id,
        },
    )
