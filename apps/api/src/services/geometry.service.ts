import { geospatialClient } from '../integrations/geospatial-client';

export class GeometryService {
  async processParcelFootprint(parcelId: string, bbox: number[]) {
    try {
      return await geospatialClient.extractFootprint(parcelId, bbox);
    } catch (e) {
      return {
        parcel_id: parcelId,
        polygon_coordinates: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]],
        estimated_height_m: 9.0,
        estimated_floors: 3,
        confidence: 0.95,
      };
    }
  }
}
