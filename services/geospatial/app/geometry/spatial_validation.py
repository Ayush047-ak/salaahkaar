from shapely.geometry import Polygon
from typing import Dict, Any

class SpatialValidator:
    @staticmethod
    def validate_cadastral_boundary(coords: list) -> Dict[str, Any]:
        try:
            poly = Polygon(coords)
            is_valid = poly.is_valid
            area = poly.area if is_valid else 0.0
            return {
                "valid": is_valid,
                "area_sq_units": area,
                "is_closed": poly.exterior.is_ring if hasattr(poly, 'exterior') else False
            }
        except Exception as e:
            return {"valid": False, "error": str(e)}
