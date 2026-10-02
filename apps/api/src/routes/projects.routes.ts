import { Router } from 'express';
import { ProjectService } from '../services/project.service';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const service = new ProjectService();

// GET /api/v1/projects — list all projects
router.get('/', asyncHandler(async (_req, res) => {
  const list = await service.listProjects();
  res.json({ success: true, data: list });
}));

// POST /api/v1/projects — create a new project
router.post('/', asyncHandler(async (req, res) => {
  const { name, description, region, crs } = req.body;
  if (!name || !region) {
    res.status(400).json({ success: false, error: { message: 'name and region are required' } });
    return;
  }
  const project = await service.createProject({ name, description, region, crs });
  res.status(201).json({ success: true, data: project });
}));

// GET /api/v1/projects/:id — get project details
router.get('/:id', asyncHandler(async (req, res) => {
  const project = await service.getProjectById(req.params.id);
  if (!project) {
    res.status(404).json({ success: false, error: { message: 'Project not found' } });
    return;
  }
  res.json({ success: true, data: project });
}));

// GET /api/v1/projects/:id/status — get project workflow status with stats
router.get('/:id/status', asyncHandler(async (req, res) => {
  const status = await service.getProjectStatus(req.params.id);
  if (!status) {
    res.status(404).json({ success: false, error: { message: 'Project not found' } });
    return;
  }
  res.json({ success: true, data: status });
}));

// PATCH /api/v1/projects/:id/status — update project status
router.patch('/:id/status', asyncHandler(async (req, res) => {
  const { status } = req.body;
  const project = await service.updateProjectStatus(req.params.id, status);
  if (!project) {
    res.status(404).json({ success: false, error: { message: 'Project not found' } });
    return;
  }
  res.json({ success: true, data: project });
}));

export default router;
