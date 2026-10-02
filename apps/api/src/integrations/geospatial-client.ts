import axios from 'axios';
import { config } from '../config';

const client = axios.create({
  baseURL: config.geospatialServiceUrl,
  timeout: 30000,
});

export const geospatialClient = {
  checkHealth: async () => {
    const res = await client.get('/health');
    return res.data;
  },
  extractFootprint: async (parcelId: string, boundingBox: number[]) => {
    const res = await client.post('/api/extract', {
      parcel_id: parcelId,
      bounding_box: boundingBox,
    });
    return res.data;
  },
  reconcileBoundaries: async (parcelA: number[][], parcelB: number[][], easement?: number[][]) => {
    const res = await client.post('/api/reconcile', {
      parcel_a_coords: parcelA,
      parcel_b_coords: parcelB,
      easement_coords: easement,
    });
    return res.data;
  },
};
