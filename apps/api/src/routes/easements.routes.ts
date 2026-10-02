import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'e-501',
        name: 'Sector Drainage & Pipeline Easement',
        easementType: 'DRAINAGE',
        bufferWidthMeters: 3.5,
        encumberedParcels: ['p-102'],
        status: 'ACTIVE_RESTRICTION',
      },
    ],
  });
});

export default router;
