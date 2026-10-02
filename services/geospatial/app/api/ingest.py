from fastapi import APIRouter, UploadFile, File, Form
from app.pipelines.ingestion_pipeline import IngestionPipeline

router = APIRouter(prefix="/api/ingest", tags=["Ingestion"])
pipeline = IngestionPipeline()

@router.post("/upload")
async def upload_geospatial_file(
    file: UploadFile = File(...),
    dataset_type: str = Form("pointcloud")
):
    result = pipeline.process_incoming_file(file.filename, dataset_type)
    return {"message": "File received for processing", "details": result}
