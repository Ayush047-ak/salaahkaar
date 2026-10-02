from fastapi import APIRouter
from app.schemas.spatial_schema import ReconciliationRequest, ReconciliationResponse
from app.pipelines.reconciliation_pipeline import ReconciliationPipeline

router = APIRouter(prefix="/api/reconcile", tags=["Reconciliation"])
pipeline = ReconciliationPipeline()

@router.post("", response_model=ReconciliationResponse)
def reconcile_boundaries(req: ReconciliationRequest):
    result = pipeline.reconcile_parcels(req.parcel_a_coords, req.parcel_b_coords, req.easement_coords)
    boundary_conflict = result["boundary_conflict"]
    return ReconciliationResponse(
        has_overlap=boundary_conflict["has_overlap"],
        overlap_area_sqm=boundary_conflict["overlap_area_sqm"],
        encroachment_severity=boundary_conflict["severity"]
    )
