import numpy as np
from typing import Dict, Any, List
from app.processors.pointcloud_processor import PointCloudProcessor
from app.utils.logger import get_logger

logger = get_logger("PreprocessingPipeline")

class PreprocessingPipeline:
    def __init__(self):
        self.processor = PointCloudProcessor()

    def run(self, raw_points: np.ndarray, bbox: List[float]) -> Dict[str, Any]:
        logger.info(f"Running preprocessing on {len(raw_points)} points with bbox: {bbox}")
        sliced = self.processor.slice_by_bbox(raw_points, bbox)
        filtered = self.processor.filter_ground_and_vegetation(sliced)
        return {
            "initial_points": len(raw_points),
            "retained_building_points": len(filtered),
            "points": filtered
        }
