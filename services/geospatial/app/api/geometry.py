from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from shapely.geometry import Polygon
from app.processors.mesh_generator import MeshGenerator

router = APIRouter(prefix="/api/geometry", tags=["Geometry"])
generator = MeshGenerator()

class MeshGenRequest(BaseModel):
    parcel_id: str
    coordinates: List[List[float]]
    height_m: float = 9.0

@router.post("/mesh")
def generate_mesh(req: MeshGenRequest):
    poly = Polygon(req.coordinates)
    mesh = generator.extrude_polygon_to_3d_mesh(poly, req.height_m)
    return {
        "parcel_id": req.parcel_id,
        "faces": len(mesh.faces),
        "vertices": len(mesh.vertices),
        "volume": float(mesh.volume) if mesh.is_watertight else 0.0
    }
