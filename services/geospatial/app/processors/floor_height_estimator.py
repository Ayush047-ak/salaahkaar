import numpy as np
from typing import Dict, Any

class FloorHeightEstimator:
    DEFAULT_STANDARD_FLOOR_HEIGHT_M = 3.0

    def estimate_levels(self, min_z: float, max_z: float) -> Dict[str, Any]:
        total_height = max(0.0, max_z - min_z)
        floors = max(1, int(np.round(total_height / self.DEFAULT_STANDARD_FLOOR_HEIGHT_M)))
        return {
            "total_height_meters": round(total_height, 2),
            "estimated_floor_count": floors,
            "average_floor_height_meters": round(total_height / floors, 2) if floors else self.DEFAULT_STANDARD_FLOOR_HEIGHT_M
        }
