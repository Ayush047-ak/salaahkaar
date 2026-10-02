import { ConflictRepository } from '../repositories/conflict.repository';

export class ConflictService {
  private repo = new ConflictRepository();

  async getConflictsByProject(projectId: string) {
    const conflicts = await this.repo.findByProjectId(projectId);
    return conflicts.map((c) => ({
      id: c.id,
      projectId: c.project_id,
      category: c.category,
      severity: c.severity,
      title: c.title,
      description: c.description,
      affectedParcelIds: c.affected_parcel_ids,
      affectedUnitIds: c.affected_unit_ids,
      spatialDiscrepancy: {
        overlapAreaSqMeters: c.overlap_area_sqm,
        encroachmentDistanceMeters: c.encroachment_distance_m,
        violationGeometry: c.violation_geojson,
      },
      evidenceSummary: {
        cadastralSource: c.cadastral_source,
        lidarSource: c.lidar_source,
        registryDeedRef: c.registry_deed_ref,
        confidenceScore: c.confidence_score,
      },
      resolutionStatus: c.resolution_status,
      detectedAt: c.detected_at,
      updatedAt: c.updated_at,
    }));
  }

  async getConflictById(id: string) {
    const c = await this.repo.findById(id);
    if (!c) return null;

    const evidence = await this.repo.getEvidenceForConflict(id);

    return {
      id: c.id,
      projectId: c.project_id,
      category: c.category,
      severity: c.severity,
      title: c.title,
      description: c.description,
      affectedParcelIds: c.affected_parcel_ids,
      spatialDiscrepancy: {
        overlapAreaSqMeters: c.overlap_area_sqm,
        encroachmentDistanceMeters: c.encroachment_distance_m,
        violationGeometry: c.violation_geojson,
      },
      evidenceSummary: {
        cadastralSource: c.cadastral_source,
        lidarSource: c.lidar_source,
        registryDeedRef: c.registry_deed_ref,
        confidenceScore: c.confidence_score,
      },
      evidence,
      resolutionStatus: c.resolution_status,
      detectedAt: c.detected_at,
      updatedAt: c.updated_at,
    };
  }

  async updateResolution(id: string, status: string) {
    return this.repo.updateResolutionStatus(id, status);
  }
}
