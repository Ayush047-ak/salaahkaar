export interface Coordinate2D {
  lat: number;
  lng: number;
  elevation?: number;
}

export interface ParcelBoundary {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

export interface Parcel {
  id: string;
  projectId: string;
  khasraNumber: string;
  surveyNumber: string;
  ownerName: string;
  claimedAreaSqMeters: number;
  calculatedAreaSqMeters: number;
  boundary: ParcelBoundary;
  zoningType: 'Residential' | 'Commercial' | 'Agricultural' | 'Mixed' | 'Industrial';
  status: 'Unverified' | 'Processing' | 'Conflict' | 'Reconciled' | 'Approved';
  createdAt: string;
  updatedAt: string;
}
