import { queryPostgres } from '../integrations/postgres.client';

export interface ConflictRow {
  id: string;
  project_id: string;
  category: string;
  severity: string;
  title: string;
  description: string | null;
  affected_parcel_ids: string[];
  affected_unit_ids: string[] | null;
  overlap_area_sqm: number | null;
  encroachment_distance_m: number | null;
  violation_geojson: any;
  cadastral_source: string | null;
  lidar_source: string | null;
  registry_deed_ref: string | null;
  confidence_score: number;
  resolution_status: string;
  detected_at: string;
  updated_at: string;
}

export class ConflictRepository {
  async findByProjectId(projectId: string): Promise<ConflictRow[]> {
    const result = await queryPostgres(
      `SELECT id, project_id, category, severity, title, description,
              affected_parcel_ids, affected_unit_ids,
              overlap_area_sqm, encroachment_distance_m,
              ST_AsGeoJSON(violation_geom)::json as violation_geojson,
              cadastral_source, lidar_source, registry_deed_ref,
              confidence_score, resolution_status,
              detected_at, updated_at
       FROM conflicts
       WHERE project_id = $1
       ORDER BY severity DESC, detected_at DESC`,
      [projectId]
    );
    return result.rows;
  }

  async findById(id: string): Promise<ConflictRow | null> {
    const result = await queryPostgres(
      `SELECT id, project_id, category, severity, title, description,
              affected_parcel_ids, affected_unit_ids,
              overlap_area_sqm, encroachment_distance_m,
              ST_AsGeoJSON(violation_geom)::json as violation_geojson,
              cadastral_source, lidar_source, registry_deed_ref,
              confidence_score, resolution_status,
              detected_at, updated_at
       FROM conflicts WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async updateResolutionStatus(id: string, status: string): Promise<ConflictRow | null> {
    const result = await queryPostgres(
      `UPDATE conflicts SET resolution_status = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *, ST_AsGeoJSON(violation_geom)::json as violation_geojson`,
      [id, status]
    );
    return result.rows[0] || null;
  }

  async getEvidenceForConflict(conflictId: string) {
    const result = await queryPostgres(
      `SELECT e.*, sd.original_name as source_name, sd.dataset_type as source_type
       FROM evidence e
       LEFT JOIN source_datasets sd ON e.source_dataset_id = sd.id
       WHERE e.conflict_id = $1
       ORDER BY e.created_at`,
      [conflictId]
    );
    return result.rows;
  }
}
