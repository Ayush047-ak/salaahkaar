from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/reconcile", tags=["Reconciliation"])


class ReconciliationRequest(BaseModel):
    parcel_a_coords: List[List[float]]
    parcel_b_coords: List[List[float]]
    easement_coords: Optional[List[List[float]]] = None


@router.post("")
def reconcile_boundaries(req: ReconciliationRequest):
    return JSONResponse(
        status_code=503,
        content={
            "error": "service_unavailable",
            "message": (
                "Boundary reconciliation requires shapely/geopandas which exceed "
                "Vercel's 250 MB bundle limit. "
                "Deploy the full service to Railway/Render/Fly.io."
            ),
        },
    )
