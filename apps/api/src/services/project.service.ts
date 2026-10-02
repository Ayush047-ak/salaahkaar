import { ProjectRepository } from '../repositories/project.repository';

export class ProjectService {
  private repo = new ProjectRepository();

  async listProjects() {
    return this.repo.findAll();
  }

  async getProjectById(id: string) {
    return this.repo.findById(id);
  }

  async createProject(data: { name: string; description?: string; region: string; crs?: string }) {
    return this.repo.create(data);
  }

  async getProjectStatus(projectId: string) {
    const project = await this.repo.findById(projectId);
    if (!project) return null;

    const stats = await this.repo.getStats(projectId);

    return {
      projectId: project.id,
      name: project.name,
      region: project.region,
      stage: project.status,
      progressPercentage: this.calculateProgress(project.status),
      totalParcels: parseInt(stats.parcels.total, 10),
      conflictsCount: {
        total: parseInt(stats.conflicts.total, 10),
        open: parseInt(stats.conflicts.open, 10),
        resolved: parseInt(stats.conflicts.resolved, 10),
      },
    };
  }

  async updateProjectStatus(id: string, status: string) {
    return this.repo.updateStatus(id, status);
  }

  private calculateProgress(stage: string): number {
    const stages: Record<string, number> = {
      DATA_INTAKE: 15,
      POINTCLOUD_PREPROCESSING: 30,
      FOOTPRINT_EXTRACTION: 50,
      RECONCILIATION: 65,
      CONFLICT_GRAPHING: 80,
      VERIFICATION_COMPLETE: 100,
    };
    return stages[stage] || 0;
  }
}
