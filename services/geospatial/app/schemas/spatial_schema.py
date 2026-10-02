from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Point3D(BaseModel):
    x: float
    y: float
    z: float

class FootprintExtractionRequest(BaseModel):
    parcel_id: str
    bounding_box: List[float] = Field(..., description="[min_x, min_y, max_x, max_y]")
    target_crs: str = "EPSG:4326"

class FootprintExtractionResponse(BaseModel):
    parcel_id: str
    polygon_coordinates: List[List[List[float]]]
    estimated_height_m: float
    estimated_floors: int
    confidence: float

class ReconciliationRequest(BaseModel):
    parcel_a_coords: List[List[float]]
    parcel_b_coords: List[List[float]]
    easement_coords: Optional[List[List[float]]] = None

class ReconciliationResponse(BaseModel):
    has_overlap: bool
    overlap_area_sqm: float
    encroachment_severity: str
    overlap_polygon: Optional[List[List[float]]] = None
