from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/preprocess", tags=["Preprocessing"])


class PreprocessRequest(BaseModel):
    bbox: List[float]
    sample_point_count: int = 1000


@router.post("")
def preprocess_dataset(req: PreprocessRequest):
    return JSONResponse(
        status_code=503,
        content={
            "error": "service_unavailable",
            "message": (
                "Preprocessing requires numpy/scipy which exceed Vercel's 250 MB limit. "
                "Deploy the full service to Railway/Render/Fly.io."
            ),
            "bbox": req.bbox,
        },
    )
