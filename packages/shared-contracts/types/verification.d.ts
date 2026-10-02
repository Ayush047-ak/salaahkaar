export interface VerificationAction {
    id: string;
    conflictId?: string;
    parcelId: string;
    officerId: string;
    officerName: string;
    decision: 'APPROVE_AS_SURVEYED' | 'ENFORCE_DEED_BOUNDARY' | 'REQUEST_FIELD_RE_SURVEY' | 'ISSUE_ENCROACHMENT_NOTICE' | 'ADJUST_EASEMENT';
    notes: string;
    stipulatedConditions?: string[];
    signatureHash: string;
    timestamp: string;
}
export interface ProjectWorkflowStatus {
    projectId: string;
    stage: 'DATA_INTAKE' | 'POINTCLOUD_PREPROCESSING' | 'FOOTPRINT_EXTRACTION' | 'RECONCILIATION' | 'CONFLICT_GRAPHING' | 'VERIFICATION_COMPLETE';
    progressPercentage: number;
    totalParcels: number;
    conflictsCount: {
        total: number;
        open: number;
        resolved: number;
    };
}
