import numpy as np
from typing import Dict, Any, List
from app.processors.footprint_extractor import FootprintExtractor
from app.processors.floor_height_estimator import FloorHeightEstimator
from app.fallback.deterministic_extractor import DeterministicExtractor
from app.utils.logger import get_logger

logger = get_logger("ExtractionPipeline")

class ExtractionPipeline:
    def __init__(self):
        self.footprint_extractor = FootprintExtractor()
        self.floor_estimator = FloorHeightEstimator()

    def run(self, points: np.ndarray, bbox: List[float], parcel_id: str) -> Dict[str, Any]:
        logger.info(f"Extracting 3D geometry for parcel {parcel_id}")
        if points is not None and len(points) >= 10:
            points_2d = points[:, :2]
            polygon = self.footprint_extractor.extract_alpha_shape(points_2d)
            if polygon:
                coords = [list(c) for c in polygon.exterior.coords]
                min_z = float(np.min(points[:, 2]))
                max_z = float(np.max(points[:, 2]))
                levels = self.floor_estimator.estimate_levels(min_z, max_z)
                return {
                    "parcel_id": parcel_id,
                    "polygon": coords,
                    "levels": levels,
                    "source": "LIDAR_POINT_CLOUD"
                }

        # Fallback to deterministic bbox extraction
        logger.warn(f"Points insufficient. Using deterministic fallback for parcel {parcel_id}")
        coords = DeterministicExtractor.infer_synthetic_footprint(bbox)
        levels = self.floor_estimator.estimate_levels(0.0, 12.0)
        return {
            "parcel_id": parcel_id,
            "polygon": coords,
            "levels": levels,
            "source": "SYNTHETIC_DETERMINISTIC_FALLBACK"
        }
