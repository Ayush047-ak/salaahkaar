import { queryPostgres } from '../integrations/postgres.client';

export interface VerificationRow {
  id: string;
  conflict_id: string | null;
  parcel_id: string;
  officer_id: string;
  officer_name: string;
  decision: string;
  notes: string | null;
  stipulated_conditions: string[] | null;
  signature_hash: string;
  created_at: string;
}

export class VerificationRepository {
  async save(data: {
    conflictId?: string;
    parcelId: string;
    officerId: string;
    officerName: string;
    decision: string;
    notes?: string;
    stipulatedConditions?: string[];
    signatureHash: string;
  }): Promise<VerificationRow> {
    const result = await queryPostgres(
      `INSERT INTO verifications (conflict_id, parcel_id, officer_id, officer_name, decision, notes, stipulated_conditions, signature_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.conflictId || null,
        data.parcelId,
        data.officerId,
        data.officerName,
        data.decision,
        data.notes || null,
        data.stipulatedConditions || null,
        data.signatureHash,
      ]
    );
    return result.rows[0];
  }

  async findByParcelId(parcelId: string): Promise<VerificationRow[]> {
    const result = await queryPostgres(
      `SELECT * FROM verifications WHERE parcel_id = $1 ORDER BY created_at DESC`,
      [parcelId]
    );
    return result.rows;
  }

  async findByConflictId(conflictId: string): Promise<VerificationRow[]> {
    const result = await queryPostgres(
      `SELECT * FROM verifications WHERE conflict_id = $1 ORDER BY created_at DESC`,
      [conflictId]
    );
    return result.rows;
  }

  async findAll(): Promise<VerificationRow[]> {
    const result = await queryPostgres(
      `SELECT v.*, p.khasra_number, p.owner_name as parcel_owner
       FROM verifications v
       LEFT JOIN parcels p ON v.parcel_id = p.id
       ORDER BY v.created_at DESC
       LIMIT 100`
    );
    return result.rows;
  }
}
