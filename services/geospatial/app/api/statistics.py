from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np

router = APIRouter(prefix="/api/statistics", tags=["Statistics"])

class SpatialStatsRequest(BaseModel):
    project_id: str
    parcels: List[Dict[str, Any]] # expects list of geojson features

@router.post("")
def calculate_statistics(req: SpatialStatsRequest):
    # Dummy implementation for spatial statistics
    total_area = 0.0
    for parcel in req.parcels:
        # Simplistic area calculation for demo
        coords = np.array(parcel.get("geometry", {}).get("coordinates", [[[0,0]]])[0])
        if len(coords) > 2:
            x = coords[:, 0]
            y = coords[:, 1]
            area = 0.5 * np.abs(np.dot(x, np.roll(y, 1)) - np.dot(y, np.roll(x, 1)))
            # rough conversion from degrees to sqm if coords look like lat/lon
            if np.max(x) < 180 and np.max(y) < 90:
                area = area * 111320 * 111320 * np.cos(np.radians(np.mean(y)))
            total_area += area
            
    return {
        "project_id": req.project_id,
        "total_parcels": len(req.parcels),
        "total_area_sqm": round(total_area, 2),
        "avg_parcel_size_sqm": round(total_area / len(req.parcels), 2) if req.parcels else 0.0
    }
