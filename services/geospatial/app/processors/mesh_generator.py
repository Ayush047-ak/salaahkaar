import trimesh
from shapely.geometry import Polygon
import numpy as np

class MeshGenerator:
    def extrude_polygon_to_3d_mesh(self, polygon: Polygon, height_m: float) -> trimesh.Trimesh:
        """Extrudes a 2D shapely Polygon into a 3D volumetric Trimesh manifold."""
        mesh = trimesh.creation.extrude_polygon(polygon, height=height_m)
        return mesh

    def export_gltf(self, mesh: trimesh.Trimesh, output_path: str):
        mesh.export(output_path, file_type='glb')
