from shapely.geometry import Polygon, LineString
from typing import Dict, Any

class EasementChecker:
    @staticmethod
    def check_easement_encroachment(parcel_coords: list, easement_line_coords: list, easement_buffer_m: float = 3.0) -> Dict[str, Any]:
        parcel = Polygon(parcel_coords)
        easement_line = LineString(easement_line_coords)
        easement_zone = easement_line.buffer(easement_buffer_m)

        encroachment = parcel.intersection(easement_zone)
        has_encroachment = not encroachment.is_empty and encroachment.area > 0.01

        return {
            "is_encroaching": has_encroachment,
            "encroached_area_sqm": round(float(encroachment.area), 2) if has_encroachment else 0.0,
            "required_clearance_meters": easement_buffer_m
        }
