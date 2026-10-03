from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from app.pipelines.volume_pipeline import VolumePipeline

router = APIRouter(prefix="/api/volumes", tags=["Volumes"])
pipeline = VolumePipeline()

class VolumeGenerationRequest(BaseModel):
    parcel_id: str
    footprint: List[List[float]]
    base_elevation: float = 0.0
    height: float
    floors: int = 1

class VolumeGenerationResponse(BaseModel):
    parcel_id: str
    building_volume: Dict[str, Any]
    floor_volumes: List[Dict[str, Any]]

@router.post("", response_model=VolumeGenerationResponse)
def generate_volume(req: VolumeGenerationRequest):
    result = pipeline.run(req.parcel_id, req.footprint, req.base_elevation, req.height, req.floors)
    return VolumeGenerationResponse(
        parcel_id=result["parcel_id"],
        building_volume=result["building_volume"],
        floor_volumes=result["floor_volumes"]
    )
