import os
from app.config import settings

class FileStorageManager:
    @staticmethod
    def ensure_directories():
        os.makedirs(settings.PROCESSED_DIR, exist_ok=True)
        os.makedirs(os.path.join(settings.DATA_DIR, "samples/pointcloud"), exist_ok=True)
        os.makedirs(os.path.join(settings.DATA_DIR, "samples/parcels"), exist_ok=True)

    @staticmethod
    def get_mesh_path(building_id: str) -> str:
        return os.path.join(settings.PROCESSED_DIR, f"{building_id}_mesh.gltf")
