import numpy as np
from typing import Dict, Any, List
from shapely.geometry import Polygon
import trimesh

class VolumeGenerator:
    @staticmethod
    def generate_3d_volume(footprint: List[List[float]], base_elevation: float, height: float) -> Dict[str, Any]:
        """
        Extrudes a 2D footprint into a 3D volume using Shapely for 2D topology and Trimesh/Open3D for 3D extrusion.
        """
        if not footprint or len(footprint) < 3:
            raise ValueError("Footprint must contain at least 3 points to form a polygon.")
            
        # 1. Create a 2D Polygon using Shapely
        poly = Polygon(footprint)
        
        if not poly.is_valid:
            poly = poly.buffer(0) # Attempt to fix self-intersections
            
        # Get area and bounds from Shapely
        area = poly.area
        min_x, min_y, max_x, max_y = poly.bounds
        
        min_z = base_elevation
        max_z = base_elevation + height
        volume = area * height
        
        # 2. Extrude the polygon into a 3D Mesh using trimesh
        try:
            # Create the 2D polygon in trimesh
            vertices = np.array(poly.exterior.coords)
            mesh = trimesh.creation.extrude_polygon(poly, height=height)
            # Translate to base elevation
            mesh.apply_translation([0, 0, base_elevation])
            
            # Open3D logic removed for Vercel deployment compatibility (it was unused here anyway)
            
            # Convert mesh back to serializable vertices for the frontend (JSON/GeoJSON structure)
            mesh_vertices = mesh.vertices.tolist()
            mesh_faces = mesh.faces.tolist()
        except Exception as e:
            # Fallback if extrusion fails
            mesh_vertices = []
            mesh_faces = []

        return {
            "bbox": {
                "min": [float(min_x), float(min_y), float(min_z)],
                "max": [float(max_x), float(max_y), float(max_z)]
            },
            "area_sqm": float(area),
            "volume_cubic_m": float(volume),
            "base_elevation_m": float(base_elevation),
            "height_m": float(height),
            "mesh": {
                "vertices": mesh_vertices,
                "faces": mesh_faces
            }
        }
