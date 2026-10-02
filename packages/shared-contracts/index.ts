// Shared type contracts for the Salaahkaar platform
// Re-export everything from domain-specific type files

export type { Coordinate2D, ParcelBoundary, Parcel } from './types/parcel';
export type { FloorLevel, PropertyUnit } from './types/property-unit';
export type { ConflictSeverity, ConflictCategory, Conflict } from './types/conflict';
export type { VerificationAction, ProjectWorkflowStatus } from './types/verification';
export type { RelationshipType, GraphNode, GraphEdge, PropertyGraph } from './types/relationship';

// Common utility types
export type ID = string;
export type ISODateTime = string;

// API response envelope
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Workflow pipeline types
export type PipelineStage =
  | 'DATA_INTAKE'
  | 'POINTCLOUD_PREPROCESSING'
  | 'FOOTPRINT_EXTRACTION'
  | 'RECONCILIATION'
  | 'CONFLICT_GRAPHING'
  | 'VERIFICATION_COMPLETE';

export interface PipelineJob {
  jobId: string;
  projectId: string;
  pipelineType: string;
  stage: PipelineStage;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress: number;
  startedAt: ISODateTime;
  completedAt?: ISODateTime;
  error?: string;
}

// Source dataset metadata
export interface SourceDataset {
  id: ID;
  projectId: ID;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  datasetType: 'POINTCLOUD' | 'CADASTRAL_PARCEL' | 'BUILDING_FOOTPRINT' | 'REGISTRY_DEED' | 'SURVEY_MAP' | 'OTHER';
  status: 'UPLOADED' | 'VALIDATING' | 'READY' | 'PROCESSING' | 'FAILED';
  recordCount?: number;
  crs?: string;
  uploadedAt: ISODateTime;
}

// Evidence linking
export interface Evidence {
  id: ID;
  conflictId: ID;
  sourceDatasetId?: ID;
  evidenceType: 'LIDAR_SCAN' | 'CADASTRAL_MAP' | 'REGISTRY_DEED' | 'SURVEY_REPORT' | 'PHOTOGRAPH' | 'COMPUTED';
  title: string;
  description: string;
  referenceUri?: string;
  createdAt: ISODateTime;
}

// Easement
export interface Easement {
  id: ID;
  projectId: ID;
  name: string;
  easementType: 'DRAINAGE' | 'ACCESS_ROAD' | 'PIPELINE' | 'POWER_LINE' | 'RIGHT_OF_WAY' | 'OTHER';
  bufferWidthMeters: number;
  encumberedParcelIds: string[];
  status: 'ACTIVE_RESTRICTION' | 'PENDING_REVIEW' | 'LIFTED';
  geometry?: {
    type: 'LineString' | 'Polygon';
    coordinates: number[][] | number[][][];
  };
  createdAt: ISODateTime;
}
