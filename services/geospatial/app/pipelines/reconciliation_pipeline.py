from typing import Dict, Any, List
from app.geometry.conflict_detection import ConflictDetector
from app.geometry.easement_checks import EasementChecker
from app.utils.logger import get_logger

logger = get_logger("ReconciliationPipeline")

class ReconciliationPipeline:
    def reconcile_parcels(self, parcel_a: List[List[float]], parcel_b: List[List[float]], easement: List[List[float]] = None) -> Dict[str, Any]:
        logger.info("Executing topological boundary reconciliation")
        overlap_result = ConflictDetector.detect_overlap(parcel_a, parcel_b)

        easement_result = None
        if easement:
            easement_result = EasementChecker.check_easement_encroachment(parcel_a, easement)

        return {
            "boundary_conflict": overlap_result,
            "easement_conflict": easement_result,
            "status": "CONFLICT_DETECTED" if overlap_result["has_overlap"] else "RECONCILED"
        }
