from dataclasses import dataclass
from typing import List, Optional

@dataclass
class BuildingModel:
    id: str
    parcel_id: str
    footprint_coords: List[List[float]]
    total_height_m: float
    total_floors: int
    mesh_path: Optional[str] = None
