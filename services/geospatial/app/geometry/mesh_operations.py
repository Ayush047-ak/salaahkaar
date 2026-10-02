import trimesh
from typing import Dict, Any

class MeshOperations:
    @staticmethod
    def inspect_mesh(mesh: trimesh.Trimesh) -> Dict[str, Any]:
        return {
            "is_watertight": mesh.is_watertight,
            "volume_m3": mesh.volume if mesh.is_watertight else None,
            "vertex_count": len(mesh.vertices),
            "face_count": len(mesh.faces),
            "bounds": mesh.bounds.tolist()
        }
