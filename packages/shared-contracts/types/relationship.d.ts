export type RelationshipType = 'ADJACENT_TO' | 'OVERLAPS_WITH' | 'CONTAINS_UNIT' | 'ENCROACHES_ON' | 'SUBJECT_TO_EASEMENT' | 'SERVES_ACCESS_ROAD' | 'SHARED_PARTY_WALL';
export interface GraphNode {
    id: string;
    label: string;
    type: 'Parcel' | 'Building' | 'Unit' | 'EasementPath' | 'LegalEntity';
    properties: Record<string, any>;
}
export interface GraphEdge {
    id: string;
    source: string;
    target: string;
    type: RelationshipType;
    weight?: number;
    properties: {
        overlapAreaSqMeters?: number;
        encroachmentSeverity?: 'Low' | 'Medium' | 'High' | 'Critical';
        legalInstrumentRef?: string;
        [key: string]: any;
    };
}
export interface PropertyGraph {
    nodes: GraphNode[];
    edges: GraphEdge[];
}
