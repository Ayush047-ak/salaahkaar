from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api/ingest", tags=["Ingestion"])


@router.post("/upload")
async def upload_geospatial_file(
    file: UploadFile = File(...),
    dataset_type: str = Form("pointcloud"),
):
    return JSONResponse(
        status_code=503,
        content={
            "error": "service_unavailable",
            "message": (
                "Geospatial ingestion requires the full service hosted on a "
                "container platform (Railway/Render/Fly.io). "
                "This Vercel deployment is a stub."
            ),
            "filename": file.filename,
            "dataset_type": dataset_type,
        },
    )
