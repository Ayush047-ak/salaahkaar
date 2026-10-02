from dataclasses import dataclass
from typing import List

@dataclass
class ExtractionResult:
    parcel_id: str
    polygon: List[List[float]]
    confidence: float
    point_count: int
    used_fallback: bool
