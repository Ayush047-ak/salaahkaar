from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/extract", tags=["Extraction"])


class FootprintExtractionRequest(BaseModel):
    parcel_id: str
    bounding_box: List[float]


@router.post("")
def extract_footprint(req: FootprintExtractionRequest):
    return JSONResponse(
        status_code=503,
        content={
            "error": "service_unavailable",
            "message": (
                "Footprint extraction requires rasterio/laspy/scipy which exceed "
                "Vercel's 250 MB bundle limit. "
                "Deploy the full service to Railway/Render/Fly.io."
            ),
            "parcel_id": req.parcel_id,
        },
    )
