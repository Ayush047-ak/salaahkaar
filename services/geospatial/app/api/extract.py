from fastapi import APIRouter
from app.schemas.spatial_schema import FootprintExtractionRequest, FootprintExtractionResponse
from app.pipelines.extraction_pipeline import ExtractionPipeline

router = APIRouter(prefix="/api/extract", tags=["Extraction"])
pipeline = ExtractionPipeline()

@router.post("", response_model=FootprintExtractionResponse)
def extract_footprint(req: FootprintExtractionRequest):
    result = pipeline.run(None, req.bounding_box, req.parcel_id)
    return FootprintExtractionResponse(
        parcel_id=req.parcel_id,
        polygon_coordinates=[result["polygon"]],
        estimated_height_m=result["levels"]["total_height_meters"],
        estimated_floors=result["levels"]["estimated_floor_count"],
        confidence=0.96
    )
