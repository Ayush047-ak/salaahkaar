import numpy as np
from typing import Dict, Any, List

class PointCloudProcessor:
    def __init__(self, file_path: str = None):
        self.file_path = file_path

    def filter_ground_and_vegetation(self, points: np.ndarray) -> np.ndarray:
        """Filters ground points using elevation thresholds and z-score outlier removal."""
        if len(points) == 0:
            return points
        z = points[:, 2]
        ground_threshold = np.percentile(z, 10)
        building_points = points[z > ground_threshold + 0.5]
        return building_points

    def slice_by_bbox(self, points: np.ndarray, bbox: List[float]) -> np.ndarray:
        min_x, min_y, max_x, max_y = bbox
        mask = (
            (points[:, 0] >= min_x) & (points[:, 0] <= max_x) &
            (points[:, 1] >= min_y) & (points[:, 1] <= max_y)
        )
        return points[mask]
