import { Router } from 'express';
import { IngestionService } from '../services/ingestion.service';
import { upload } from '../middleware/upload';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const service = new IngestionService();

// POST /api/v1/ingestion/upload
router.post('/upload', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400).json({ success: false, error: { message: 'No file uploaded' } });
    return;
  }

  const { projectId, datasetType } = req.body;
  if (!projectId || !datasetType) {
    res.status(400).json({ success: false, error: { message: 'projectId and datasetType are required' } });
    return;
  }

  const result = await service.handleUpload(
    projectId,
    datasetType,
    req.file.filename,
    req.file.originalname,
    req.file.size,
    req.file.mimetype
  );

  res.status(201).json({ success: true, data: result });
}));

// GET /api/v1/ingestion/project/:projectId
router.get('/project/:projectId', asyncHandler(async (req, res) => {
  const datasets = await service.getDatasetsByProject(req.params.projectId);
  res.json({ success: true, data: datasets });
}));

export default router;
