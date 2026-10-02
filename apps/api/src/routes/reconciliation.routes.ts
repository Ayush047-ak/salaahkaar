import { Router } from 'express';
import { ConflictService } from '../services/conflict.service';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const service = new ConflictService();

// GET /api/v1/reconciliation/:projectId/conflicts — all conflicts for a project
router.get('/:projectId/conflicts', asyncHandler(async (req, res) => {
  const conflicts = await service.getConflictsByProject(req.params.projectId);
  res.json({ success: true, data: conflicts });
}));

// GET /api/v1/reconciliation/conflict/:id — single conflict detail with evidence
router.get('/conflict/:id', asyncHandler(async (req, res) => {
  const conflict = await service.getConflictById(req.params.id);
  if (!conflict) {
    res.status(404).json({ success: false, error: { message: 'Conflict not found' } });
    return;
  }
  res.json({ success: true, data: conflict });
}));

// PATCH /api/v1/reconciliation/conflict/:id/status — update conflict resolution status
router.patch('/conflict/:id/status', asyncHandler(async (req, res) => {
  const { status } = req.body;
  const conflict = await service.updateResolution(req.params.id, status);
  if (!conflict) {
    res.status(404).json({ success: false, error: { message: 'Conflict not found' } });
    return;
  }
  res.json({ success: true, data: conflict });
}));

export default router;
