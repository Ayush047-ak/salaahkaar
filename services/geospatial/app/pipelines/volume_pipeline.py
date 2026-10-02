from typing import Dict, Any, List
from app.geometry.volume_generator import VolumeGenerator
from app.utils.logger import get_logger

logger = get_logger("VolumePipeline")

class VolumePipeline:
    def run(self, parcel_id: str, footprint: List[List[float]], base_elevation: float, height: float, floors: int) -> Dict[str, Any]:
        logger.info(f"Generating 3D volume for parcel {parcel_id}")
        
        # Generate the main building volume
        building_volume = VolumeGenerator.generate_3d_volume(footprint, base_elevation, height)
        
        # Generate individual floor volumes
        floor_height = height / floors if floors > 0 else height
        floor_volumes = []
        
        for i in range(floors):
            floor_base = base_elevation + (i * floor_height)
            floor_vol = VolumeGenerator.generate_3d_volume(footprint, floor_base, floor_height)
            floor_volumes.append({
                "floor_level": i + 1,
                "volume_data": floor_vol
            })
            
        return {
            "parcel_id": parcel_id,
            "building_volume": building_volume,
            "floor_volumes": floor_volumes
        }
