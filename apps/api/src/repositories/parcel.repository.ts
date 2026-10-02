import { queryPostgres } from '../integrations/postgres.client';

export interface ParcelRow {
  id: string;
  project_id: string;
  khasra_number: string;
  survey_number: string | null;
  owner_name: string;
  claimed_area_sqm: number;
  calculated_area_sqm: number | null;
  zoning_type: string;
  geom_geojson: any;
  status: string;
  created_at: string;
  updated_at: string;
}

export class ParcelRepository {
  async findByProjectId(projectId: string): Promise<ParcelRow[]> {
    const result = await queryPostgres(
      `SELECT id, project_id, khasra_number, survey_number, owner_name,
              claimed_area_sqm, calculated_area_sqm, zoning_type,
              ST_AsGeoJSON(geom)::json as geom_geojson,
              status, created_at, updated_at
       FROM parcels
       WHERE project_id = $1
       ORDER BY khasra_number`,
      [projectId]
    );
    return result.rows;
  }

  async findById(id: string): Promise<ParcelRow | null> {
    const result = await queryPostgres(
      `SELECT id, project_id, khasra_number, survey_number, owner_name,
              claimed_area_sqm, calculated_area_sqm, zoning_type,
              ST_AsGeoJSON(geom)::json as geom_geojson,
              status, created_at, updated_at
       FROM parcels WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: {
    projectId: string;
    khasraNumber: string;
    surveyNumber?: string;
    ownerName: string;
    claimedAreaSqm: number;
    zoningType?: string;
    geojson?: any;
  }): Promise<ParcelRow> {
    const geomSql = data.geojson
      ? `ST_SetSRID(ST_GeomFromGeoJSON($7), 4326)`
      : 'NULL';

    const params: any[] = [
      data.projectId,
      data.khasraNumber,
      data.surveyNumber || null,
      data.ownerName,
      data.claimedAreaSqm,
      data.zoningType || 'Residential',
    ];

    if (data.geojson) {
      params.push(JSON.stringify(data.geojson));
    }

    const result = await queryPostgres(
      `INSERT INTO parcels (project_id, khasra_number, survey_number, owner_name, claimed_area_sqm, zoning_type, geom)
       VALUES ($1, $2, $3, $4, $5, $6, ${geomSql})
       RETURNING *, ST_AsGeoJSON(geom)::json as geom_geojson`,
      params
    );
    return result.rows[0];
  }

  async updateStatus(id: string, status: string): Promise<ParcelRow | null> {
    const result = await queryPostgres(
      `UPDATE parcels SET status = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *, ST_AsGeoJSON(geom)::json as geom_geojson`,
      [id, status]
    );
    return result.rows[0] || null;
  }

  async findOverlapping(parcelId: string): Promise<ParcelRow[]> {
    const result = await queryPostgres(
      `SELECT p2.*, ST_AsGeoJSON(p2.geom)::json as geom_geojson
       FROM parcels p1
       JOIN parcels p2 ON ST_Intersects(p1.geom, p2.geom) AND p1.id != p2.id
       WHERE p1.id = $1`,
      [parcelId]
    );
    return result.rows;
  }

  async getAll(): Promise<ParcelRow[]> {
    const result = await queryPostgres(
      `SELECT id, project_id, khasra_number, survey_number, owner_name,
              claimed_area_sqm, calculated_area_sqm, zoning_type,
              ST_AsGeoJSON(geom)::json as geom_geojson,
              status, created_at, updated_at
       FROM parcels ORDER BY khasra_number`
    );
    return result.rows;
  }
}
