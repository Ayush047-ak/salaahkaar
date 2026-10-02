import { Router } from 'express';
import { VerificationService } from '../services/verification.service';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const service = new VerificationService();

// POST /api/v1/verification/adjudicate — submit a formal adjudication
router.post('/adjudicate', asyncHandler(async (req, res) => {
  const { parcelId, conflictId, officerId, officerName, decision, notes, stipulatedConditions } = req.body;
  if (!parcelId || !officerId || !officerName || !decision) {
    res.status(400).json({ success: false, error: { message: 'Missing required adjudication fields' } });
    return;
  }
  
  const action = await service.recordDecision({
    parcelId, conflictId, officerId, officerName, decision, notes, stipulatedConditions
  });
  
  res.status(201).json({ success: true, data: action });
}));

// GET /api/v1/verification/history/:parcelId — adjudication history for a parcel
router.get('/history/:parcelId', asyncHandler(async (req, res) => {
  const list = await service.getVerificationsForParcel(req.params.parcelId);
  res.json({ success: true, data: list });
}));

// GET /api/v1/verification/conflict/:conflictId — adjudication history for a conflict
router.get('/conflict/:conflictId', asyncHandler(async (req, res) => {
  const list = await service.getVerificationsForConflict(req.params.conflictId);
  res.json({ success: true, data: list });
}));

export default router;
