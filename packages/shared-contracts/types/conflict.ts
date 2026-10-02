export type ConflictSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';

export type ConflictCategory = 
  | 'BOUNDARY_OVERLAP'
  | 'EASEMENT_ENCROACHMENT'
  | 'HEIGHT_LIMIT_VIOLATION'
  | 'SETBACK_VIOLATION'
  | 'DEED_AREA_DISCREPANCY'
  | 'MULTIPLE_TITLE_CLAIMS';

export interface Conflict {
  id: string;
  projectId: string;
  category: ConflictCategory;
  severity: ConflictSeverity;
  title: string;
  description: string;
  affectedParcelIds: string[];
  affectedUnitIds?: string[];
  spatialDiscrepancy: {
    overlapAreaSqMeters?: number;
    encroachmentDistanceMeters?: number;
    violationCoordinates?: number[][];
  };
  evidenceSummary: {
    cadastralSource: string;
    lidarSource: string;
    registryDeedRef: string;
    confidenceScore: number;
  };
  resolutionStatus: 'OPEN' | 'UNDER_REVIEW' | 'ADJUDICATED' | 'DISMISSED';
  detectedAt: string;
  updatedAt: string;
}
