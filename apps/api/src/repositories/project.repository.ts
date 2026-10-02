import { queryPostgres } from '../integrations/postgres.client';
import { v4 as uuidv4 } from 'uuid';

export interface ProjectRow {
  id: string;
  name: string;
  description: string | null;
  region: string;
  crs: string;
  status: string;
  total_parcels: number;
  created_at: string;
  updated_at: string;
}

export class ProjectRepository {
  async findAll(): Promise<ProjectRow[]> {
    const result = await queryPostgres(
      `SELECT id, name, description, region, crs, status, total_parcels,
              created_at, updated_at
       FROM projects ORDER BY updated_at DESC`
    );
    return result.rows;
  }

  async findById(id: string): Promise<ProjectRow | null> {
    const result = await queryPostgres(
      `SELECT id, name, description, region, crs, status, total_parcels,
              created_at, updated_at
       FROM projects WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: { name: string; description?: string; region: string; crs?: string }): Promise<ProjectRow> {
    const id = uuidv4();
    const result = await queryPostgres(
      `INSERT INTO projects (id, name, description, region, crs)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, data.name, data.description || null, data.region, data.crs || 'EPSG:4326']
    );
    return result.rows[0];
  }

  async updateStatus(id: string, status: string): Promise<ProjectRow | null> {
    const result = await queryPostgres(
      `UPDATE projects SET status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id, status]
    );
    return result.rows[0] || null;
  }

  async getStats(projectId: string) {
    const parcelsRes = await queryPostgres(
      `SELECT COUNT(*) as total,
              COUNT(*) FILTER (WHERE status = 'Conflict') as conflicts,
              COUNT(*) FILTER (WHERE status = 'Reconciled' OR status = 'Approved') as resolved
       FROM parcels WHERE project_id = $1`,
      [projectId]
    );
    const conflictsRes = await queryPostgres(
      `SELECT COUNT(*) as total,
              COUNT(*) FILTER (WHERE resolution_status = 'OPEN') as open,
              COUNT(*) FILTER (WHERE resolution_status != 'OPEN') as resolved
       FROM conflicts WHERE project_id = $1`,
      [projectId]
    );
    return {
      parcels: parcelsRes.rows[0],
      conflicts: conflictsRes.rows[0],
    };
  }
}
