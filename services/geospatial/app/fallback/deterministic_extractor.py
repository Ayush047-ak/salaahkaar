from typing import List, Dict, Any

class DeterministicExtractor:
    """Fallback extractor when point cloud density is sparse or incomplete."""
    @staticmethod
    def infer_synthetic_footprint(bbox: List[float], inset_ratio: float = 0.1) -> List[List[float]]:
        min_x, min_y, max_x, max_y = bbox
        dx = (max_x - min_x) * inset_ratio
        dy = (max_y - min_y) * inset_ratio
        return [
            [min_x + dx, min_y + dy],
            [max_x - dx, min_y + dy],
            [max_x - dx, max_y - dy],
            [min_x + dx, max_y - dy],
            [min_x + dx, min_y + dy]
        ]
