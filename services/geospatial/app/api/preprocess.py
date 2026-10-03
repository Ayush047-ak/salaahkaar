from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import numpy as np
from app.pipelines.preprocessing_pipeline import PreprocessingPipeline

router = APIRouter(prefix="/api/preprocess", tags=["Preprocessing"])
pipeline = PreprocessingPipeline()

class PreprocessRequest(BaseModel):
    bbox: List[float]
    sample_point_count: int = 1000

@router.post("")
def preprocess_dataset(req: PreprocessRequest):
    # Mock / Synthetic points in bbox range
    min_x, min_y, max_x, max_y = req.bbox
    xs = np.random.uniform(min_x, max_x, req.sample_point_count)
    ys = np.random.uniform(min_y, max_y, req.sample_point_count)
    zs = np.random.uniform(0.0, 15.0, req.sample_point_count)
    points = np.column_stack((xs, ys, zs))

    res = pipeline.run(points, req.bbox)
    return {
        "initial_points": res["initial_points"],
        "retained_points": res["retained_building_points"]
    }
