from shapely.geometry import Polygon, MultiPolygon
from typing import Dict, Any, Optional

class ConflictDetector:
    @staticmethod
    def detect_overlap(geom_a_coords: list, geom_b_coords: list) -> Dict[str, Any]:
        poly_a = Polygon(geom_a_coords)
        poly_b = Polygon(geom_b_coords)

        if not poly_a.is_valid or not poly_b.is_valid:
            poly_a = poly_a.buffer(0)
            poly_b = poly_b.buffer(0)

        intersection = poly_a.intersection(poly_b)
        has_overlap = not intersection.is_empty and intersection.area > 0.0001
        overlap_area = float(intersection.area) if has_overlap else 0.0

        severity = "INFO"
        if overlap_area > 50.0:
            severity = "CRITICAL"
        elif overlap_area > 10.0:
            severity = "HIGH"
        elif overlap_area > 1.0:
            severity = "WARNING"

        return {
            "has_overlap": has_overlap,
            "overlap_area_sqm": round(overlap_area, 2),
            "severity": severity,
            "intersection_geom": mapping_or_none(intersection) if has_overlap else None
        }

def mapping_or_none(geom):
    if geom.is_empty:
        return None
    from shapely.geometry import mapping
    return mapping(geom)
