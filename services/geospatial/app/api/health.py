from fastapi import APIRouter
import platform
import sys

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("")
def health_check():
    return {
        "status": "healthy",
        "service": "salaahkaar-geospatial-engine",
        "python_version": sys.version,
        "platform": platform.platform(),
        "gpu_accelerated": False
    }
