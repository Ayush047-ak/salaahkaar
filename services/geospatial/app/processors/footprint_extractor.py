from shapely.geometry import MultiPoint, Polygon
import numpy as np
from typing import List, Optional

class FootprintExtractor:
    def extract_alpha_shape(self, points_2d: np.ndarray, alpha: float = 0.5) -> Optional[Polygon]:
        """Extracts concavity footprint from 2D point cloud projections."""
        if len(points_2d) < 3:
            return None
        mp = MultiPoint(points_2d)
        hull = mp.convex_hull
        return hull if isinstance(hull, Polygon) else None

    def extract_from_bounding_box(self, bbox: List[float]) -> Polygon:
        min_x, min_y, max_x, max_y = bbox
        return Polygon([
            [min_x, min_y],
            [max_x, min_y],
            [max_x, max_y],
            [min_x, max_y],
            [min_x, min_y]
        ])
