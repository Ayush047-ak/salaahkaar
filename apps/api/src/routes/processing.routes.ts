import { Router } from 'express';
import { WorkflowService } from '../services/workflow.service';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const service = new WorkflowService();

// POST /api/v1/processing/run-pipeline
router.post('/run-pipeline', asyncHandler(async (req, res) => {
  const { projectId, pipelineType } = req.body;
  
  if (!projectId || !pipelineType) {
    res.status(400).json({ success: false, error: { message: 'projectId and pipelineType are required' } });
    return;
  }
  
  const result = await service.triggerPipeline(projectId, pipelineType);
  res.json({ success: true, data: result });
}));

export default router;
