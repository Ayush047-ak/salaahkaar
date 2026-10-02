import { Router } from 'express';
import { ParcelRepository } from '../repositories/parcel.repository';
import { PropertyRepository } from '../repositories/property.repository';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const parcelRepo = new ParcelRepository();
const propertyRepo = new PropertyRepository();

// GET /api/v1/properties/:projectId — list parcels for a project
router.get('/:projectId', asyncHandler(async (req, res) => {
  const parcels = await parcelRepo.findByProjectId(req.params.projectId);
  const mapped = parcels.map((p) => ({
    id: p.id,
    projectId: p.project_id,
    khasraNumber: p.khasra_number,
    surveyNumber: p.survey_number,
    ownerName: p.owner_name,
    claimedAreaSqMeters: parseFloat(String(p.claimed_area_sqm)),
    calculatedAreaSqMeters: p.calculated_area_sqm ? parseFloat(String(p.calculated_area_sqm)) : null,
    zoningType: p.zoning_type,
    boundary: p.geom_geojson,
    status: p.status,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));
  res.json({ success: true, data: mapped });
}));

// GET /api/v1/properties/:projectId/units — list property units for a project
router.get('/:projectId/units', asyncHandler(async (req, res) => {
  const units = await propertyRepo.getUnitsByProjectId(req.params.projectId);
  res.json({ success: true, data: units });
}));

// GET /api/v1/properties/parcel/:parcelId — get a single parcel
router.get('/parcel/:parcelId', asyncHandler(async (req, res) => {
  const parcel = await parcelRepo.findById(req.params.parcelId);
  if (!parcel) {
    res.status(404).json({ success: false, error: { message: 'Parcel not found' } });
    return;
  }
  res.json({ success: true, data: parcel });
}));

// GET /api/v1/properties/parcel/:parcelId/buildings — buildings on a parcel
router.get('/parcel/:parcelId/buildings', asyncHandler(async (req, res) => {
  const buildings = await propertyRepo.getBuildingsByParcelId(req.params.parcelId);
  res.json({ success: true, data: buildings });
}));

// GET /api/v1/properties/building/:buildingId/units — units in a building
router.get('/building/:buildingId/units', asyncHandler(async (req, res) => {
  const units = await propertyRepo.getUnitsByBuildingId(req.params.buildingId);
  res.json({ success: true, data: units });
}));

// GET /api/v1/properties/parcel/:parcelId/overlaps — find spatially overlapping parcels
router.get('/parcel/:parcelId/overlaps', asyncHandler(async (req, res) => {
  const overlapping = await parcelRepo.findOverlapping(req.params.parcelId);
  res.json({ success: true, data: overlapping });
}));

// POST /api/v1/properties/:projectId/parcels — create a new parcel
router.post('/:projectId/parcels', asyncHandler(async (req, res) => {
  const { khasraNumber, surveyNumber, ownerName, claimedAreaSqm, zoningType, geojson } = req.body;
  if (!khasraNumber || !ownerName || !claimedAreaSqm) {
    res.status(400).json({ success: false, error: { message: 'khasraNumber, ownerName, claimedAreaSqm required' } });
    return;
  }
  const parcel = await parcelRepo.create({
    projectId: req.params.projectId,
    khasraNumber, surveyNumber, ownerName, claimedAreaSqm, zoningType, geojson,
  });
  res.status(201).json({ success: true, data: parcel });
}));

export default router;
