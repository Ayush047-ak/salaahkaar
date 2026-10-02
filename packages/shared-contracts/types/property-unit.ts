export interface FloorLevel {
  floorNumber: number;
  heightOffsetMeters: number;
  ceilingHeightMeters: number;
  boundary: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  unitsCount: number;
}

export interface PropertyUnit {
  id: string;
  parcelId: string;
  buildingId: string;
  unitIdentifier: string;
  floorLevel: number;
  unitType: 'Apartment' | 'Commercial_Office' | 'Retail' | 'Common_Area' | 'Parking';
  carpetAreaSqFt: number;
  builtUpAreaSqFt: number;
  superBuiltUpAreaSqFt: number;
  volumetricBoundingBox: {
    min: [number, number, number];
    max: [number, number, number];
  };
  owner: {
    name: string;
    registryDeedNumber: string;
    sharePercentage: number;
  };
  status: 'Compliant' | 'Disputed' | 'Easement_Violation' | 'Encroachment';
}
