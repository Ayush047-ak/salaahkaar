import { queryPostgres } from '../integrations/postgres.client';
import { v4 as uuidv4 } from 'uuid';

export class WorkflowService {
  async triggerPipeline(projectId: string, pipelineType: string) {
    const jobId = `job-${uuidv4().slice(0, 8)}`;
    const geospatialUrl = process.env.GEOSPATIAL_SERVICE_URL || 'http://localhost:8000';

    const stageMap: Record<string, string> = {
      PREPROCESSING: 'POINTCLOUD_PREPROCESSING',
      EXTRACTION: 'FOOTPRINT_EXTRACTION',
      RECONCILIATION: 'RECONCILIATION',
      CONFLICT_GRAPHING: 'CONFLICT_GRAPHING',
    };

    let newStage = stageMap[pipelineType] || 'RECONCILIATION';
    
    // 1. Update status to running
    await queryPostgres(
      `UPDATE projects SET status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [projectId, newStage]
    );

    // Run the pipeline asynchronously in background
    setTimeout(async () => {
      try {
        if (pipelineType === 'RECONCILIATION') {
           // We will fetch parcels to orchestrate
           let parcelsResult = await queryPostgres(
             `SELECT id, ST_AsGeoJSON(geom)::json as geom_geojson FROM parcels WHERE project_id = $1 AND geom IS NOT NULL`,
             [projectId]
           );
           
           // For the demo: If no parcels exist for this new project, inject one automatically so the pipeline has data to process.
           if (parcelsResult.rows.length === 0) {
             console.log(`[WorkflowService] No parcels found for project ${projectId}. Injecting demo parcel.`);
             const demoGeom = `POLYGON((-20 -10, 20 -10, 15 15, -25 15, -20 -10))`;
             await queryPostgres(
               `INSERT INTO parcels (project_id, khasra_number, owner_name, claimed_area_sqm, geom) 
                VALUES ($1, 'DEMO-123', 'Demo Holdings', 1000.0, ST_GeomFromText($2, 4326))`,
               [projectId, demoGeom]
             );
             // Re-fetch
             parcelsResult = await queryPostgres(
               `SELECT id, ST_AsGeoJSON(geom)::json as geom_geojson FROM parcels WHERE project_id = $1 AND geom IS NOT NULL`,
               [projectId]
             );
           }
           
           for (const parcel of parcelsResult.rows) {
             const geom = parcel.geom_geojson;
             if (geom && geom.coordinates && geom.coordinates[0]) {
                // Call python volume generation
                await fetch(`${geospatialUrl}/api/volumes`, {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({
                     parcel_id: parcel.id,
                     footprint: geom.coordinates[0][0], // Assuming Polygon
                     base_elevation: 0.0,
                     height: 15.0,
                     floors: 4
                   })
                });
                
                // For reconciliation, hit Python reconciliation endpoint
                await fetch(`${geospatialUrl}/api/reconcile/cadastre`, {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({
                     cadastre_polygon: geom.coordinates[0][0],
                     building_footprint: geom.coordinates[0][0], // mock footprint is same as parcel for now
                     parcel_id: parcel.id
                   })
                });
             }
           }
        }
        
        // 2. Mark complete
        await queryPostgres(
          `UPDATE projects SET status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
          [projectId]
        );
      } catch (err) {
        console.error(`[WorkflowService] Pipeline ${jobId} failed:`, err);
        // Could mark status as FAILED here
      }
    }, 100); // Small delay to simulate async kickoff

    return {
      jobId,
      projectId,
      pipelineType,
      stage: newStage,
      status: 'RUNNING',
      startedAt: new Date().toISOString(),
      estimatedDurationSec: 15,
    };
  }
}

