import { Router } from 'express';
import { GraphService } from '../services/graph.service';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const graphService = new GraphService();

// GET /api/v1/graph/:projectId — full topology graph for a project
router.get('/:projectId', asyncHandler(async (req, res) => {
  const graph = await graphService.getTopologyGraph(req.params.projectId);
  res.json({ success: true, data: graph });
}));

// GET /api/v1/graph/parcel/:parcelId/neighbors — immediate neighbors of a parcel
router.get('/parcel/:parcelId/neighbors', asyncHandler(async (req, res) => {
  const neighbors = await graphService.getParcelNeighbors(req.params.parcelId);
  res.json({ success: true, data: neighbors });
}));

export default router;
