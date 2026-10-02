import crypto from 'crypto';
import { VerificationRepository } from '../repositories/verification.repository';
import { ConflictRepository } from '../repositories/conflict.repository';

export class VerificationService {
  private repo = new VerificationRepository();
  private conflictRepo = new ConflictRepository();

  async recordDecision(data: {
    conflictId?: string;
    parcelId: string;
    officerId: string;
    officerName: string;
    decision: string;
    notes?: string;
    stipulatedConditions?: string[];
  }) {
    const timestamp = new Date().toISOString();
    const payload = JSON.stringify({ ...data, timestamp });
    const signatureHash = crypto.createHash('sha256').update(payload).digest('hex');

    const saved = await this.repo.save({
      ...data,
      signatureHash,
    });

    // If tied to a conflict, update resolution status
    if (data.conflictId) {
      const newStatus = data.decision === 'APPROVE_AS_SURVEYED' ? 'ADJUDICATED' : 'UNDER_REVIEW';
      await this.conflictRepo.updateResolutionStatus(data.conflictId, newStatus);
    }

    return saved;
  }

  async getVerificationsForParcel(parcelId: string) {
    return this.repo.findByParcelId(parcelId);
  }

  async getVerificationsForConflict(conflictId: string) {
    return this.repo.findByConflictId(conflictId);
  }

  async getAllVerifications() {
    return this.repo.findAll();
  }
}
