import pytest
from app.geometry.conflict_detection import ConflictDetector
from app.processors.floor_height_estimator import FloorHeightEstimator

def test_conflict_detection():
    # Two overlapping squares
    poly_a = [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]
    poly_b = [[5, 5], [15, 5], [15, 15], [5, 15], [5, 5]]
    
    result = ConflictDetector.detect_overlap(poly_a, poly_b)
    assert result["has_overlap"] is True
    assert result["overlap_area_sqm"] == 25.0
    assert result["severity"] == "HIGH"

def test_floor_height_estimation():
    estimator = FloorHeightEstimator()
    res = estimator.estimate_levels(0.0, 12.0)
    assert res["estimated_floor_count"] == 4
    assert res["total_height_meters"] == 12.0
