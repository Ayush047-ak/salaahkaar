import { queryPostgres } from '../integrations/postgres.client';
import { v4 as uuidv4 } from 'uuid';

export class IngestionService {
  async handleUpload(projectId: string, datasetType: string, filename: string, originalName: string, sizeBytes: number, mimeType: string) {
    const id = uuidv4();
    const result = await queryPostgres(
      `INSERT INTO source_datasets (id, project_id, filename, original_name, mime_type, size_bytes, dataset_type, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'UPLOADED')
       RETURNING *`,
      [id, projectId, filename, originalName, mimeType, sizeBytes, datasetType]
    );

    // Update project status if still in DATA_INTAKE
    await queryPostgres(
      `UPDATE projects SET status = 'DATA_INTAKE', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND status = 'DATA_INTAKE'`,
      [projectId]
    );

    return result.rows[0];
  }

  async getDatasetsByProject(projectId: string) {
    const result = await queryPostgres(
      `SELECT * FROM source_datasets WHERE project_id = $1 ORDER BY uploaded_at DESC`,
      [projectId]
    );
    return result.rows;
  }

  async updateDatasetStatus(id: string, status: string, recordCount?: number) {
    const result = await queryPostgres(
      `UPDATE source_datasets SET status = $2, record_count = COALESCE($3, record_count)
       WHERE id = $1 RETURNING *`,
      [id, status, recordCount || null]
    );
    return result.rows[0] || null;
  }
}
