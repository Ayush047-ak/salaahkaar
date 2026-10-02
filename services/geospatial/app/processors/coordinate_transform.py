import numpy as np
from pyproj import Transformer
from typing import Tuple, List

class CoordinateTransformer:
    def __init__(self, source_crs: str = "EPSG:4326", target_crs: str = "EPSG:3857"):
        self.transformer = Transformer.from_crs(source_crs, target_crs, always_xy=True)
        self.inv_transformer = Transformer.from_crs(target_crs, source_crs, always_xy=True)

    def to_projected(self, lon: float, lat: float) -> Tuple[float, float]:
        return self.transformer.transform(lon, lat)

    def to_wgs84(self, x: float, y: float) -> Tuple[float, float]:
        return self.inv_transformer.transform(x, y)

    def transform_polygon(self, coords: List[List[float]]) -> List[List[float]]:
        return [list(self.to_projected(c[0], c[1])) for c in coords]
