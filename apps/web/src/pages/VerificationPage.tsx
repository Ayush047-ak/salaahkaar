import React, { useState, useEffect } from 'react';
import { RotateCw, SlidersHorizontal, Search, AlertTriangle, CheckCircle, XCircle, Edit3, Eye, ShieldAlert, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { propertiesApi, verificationApi } from '../services/projects.api';

export const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [projectFilter, setProjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pending review');
  const [comments, setComments] = useState('');
  const [actionChoice, setActionChoice] = useState<'APPROVE' | 'MODIFY' | 'REJECT'>('MODIFY');
  const [decisionConfirmed, setDecisionConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [candidateQueue, setCandidateQueue] = useState<any[]>([]);

  useEffect(() => {
    const projectId = localStorage.getItem('activeProjectId');
    if (!projectId) {
      navigate('/app/projects');
      return;
    }
    setProjectFilter(projectId);
    fetchUnits(projectId);
  }, [navigate]);

  const fetchUnits = async (projectId: string) => {
    setLoading(true);
    try {
      const units = await propertiesApi.getUnits(projectId);
      setCandidateQueue(units || []);
      if (units && units.length > 0) {
        setSelectedUnit(units[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitDecision = async () => {
    if (!selectedUnit) return;
    setSubmitting(true);
    try {
      await verificationApi.submitDecision({
        parcelId: selectedUnit.parcel_id || 'unknown',
        conflictId: null,
        officerId: 'USR-demo',
        officerName: 'Demo Reviewer',
        decision: actionChoice,
        notes: comments,
        stipulatedConditions: []
      });
      setDecisionConfirmed(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 className="page-title">Human verification</h2>
          <p className="page-subtitle">Review computational candidate units and record an explicit decision.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => fetchUnits(projectFilter)}>
            <RotateCw size={14} />
            Refresh queue
          </button>
          <button className="btn-secondary" style={{ fontSize: '0.8rem' }}>
            <SlidersHorizontal size={14} />
            Decision policy
          </button>
        </div>
      </div>

      {/* 3-Column Workbench */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1.5fr 1.2fr', gap: '20px' }}>
        {/* Column 1: Review Queue */}
        <div className="card-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h3 className="section-title">Review queue</h3>
            <p className="section-desc">Candidate units awaiting review</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>
              Project
            </label>
            <select
              className="form-input"
              value={projectFilter}
              disabled
              style={{ fontSize: '0.75rem', padding: '6px 8px', backgroundColor: '#F8FAFC' }}
            >
              <option value={projectFilter}>Active Project Workspace</option>
            </select>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 10, top: 8 }} />
            <input
              type="text"
              placeholder="Search candidate"
              className="form-input"
              style={{ paddingLeft: '28px', fontSize: '0.75rem', padding: '6px 10px 6px 28px' }}
            />
          </div>

          {/* Queue List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', maxHeight: '360px' }}>
            {loading ? (
               <div style={{ textAlign: 'center', padding: '20px', color: '#64748B' }}>
                  <Loader2 size={18} className="animate-spin inline mr-2" /> Loading...
               </div>
            ) : candidateQueue.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '20px', color: '#64748B', fontSize: '0.8rem' }}>
                  No candidates found.
               </div>
            ) : candidateQueue.map((item) => {
              const isSelected = selectedUnit?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => { setSelectedUnit(item); setDecisionConfirmed(false); }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: isSelected ? '1px solid #99DDD3' : '1px solid #E2E8F0',
                    backgroundColor: isSelected ? '#E6F6F3' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                  }}
                >
                  <span style={{ color: isSelected ? '#0D7A68' : '#334155', fontWeight: isSelected ? 600 : 400 }}>
                    {item.unit_identifier}
                  </span>
                  <span style={{ width: 14, height: 4, borderRadius: 2, backgroundColor: item.status === 'Compliant' ? '#10B981' : (item.status === 'Disputed' ? '#F59E0B' : '#DC2626') }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: 3D Candidate Preview & Meta */}
        <div className="card-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
              {selectedUnit ? selectedUnit.unit_identifier : 'Select a unit'} · Candidate 3D property
            </h3>
            {selectedUnit && <span className="badge badge-ready">{selectedUnit.status}</span>}
          </div>

          {/* Disclaimer callout banner */}
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #DBEAFE',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '0.75rem',
            color: '#1E40AF',
          }}>
            Candidate representation only — not an authoritative legal record.
          </div>

          {selectedUnit ? (
            <>
              {/* Metadata Table Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '0.78rem' }}>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.7rem' }}>Type</div>
                  <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>{selectedUnit.unit_type}</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.7rem' }}>Building</div>
                  <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '2px', wordBreak: 'break-all' }}>{selectedUnit.building_id.split('-')[0]}...</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.7rem' }}>Floor</div>
                  <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>L{selectedUnit.floor_level}</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.7rem' }}>Geometry</div>
                  <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>3D candidate</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.7rem' }}>Carpet Area</div>
                  <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>{selectedUnit.carpet_area_sqft || 'Unknown'} sqft</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.7rem' }}>Registry Deed</div>
                  <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>{selectedUnit.registry_deed_number || 'N/A'}</div>
                </div>
              </div>

              {/* 3D Candidate Preview Box */}
              <div className="viewport-dark" style={{ height: '240px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: '100%', height: '100%' }}>
                  <polygon points="60,180 260,140 280,60 80,100" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
                  <polygon points="120,150 210,130 220,90 130,110" fill="rgba(13, 148, 136, 0.4)" stroke="#2DD4BF" strokeWidth="2" />
                  <polygon points="100,160 190,140 200,60 110,80" fill="rgba(2, 132, 199, 0.2)" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>

                {selectedUnit.status !== 'Compliant' && (
                  <div style={{
                    position: 'absolute',
                    right: '40px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 0 12px rgba(220, 38, 38, 0.6)',
                  }}>
                    <AlertTriangle size={18} />
                  </div>
                )}

                <div style={{ position: 'absolute', bottom: '10px', left: '12px', fontSize: '0.72rem', color: '#94A3B8' }}>
                  3D candidate preview
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
               Select a candidate unit from the queue.
            </div>
          )}

          {/* Preview action buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" style={{ fontSize: '0.78rem' }} onClick={() => navigate('/app/property-3d')}>
              <Eye size={14} />
              Open full explorer
            </button>
          </div>
        </div>

        {/* Column 3: Evidence, Relationships & Decision Submission */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Evidence Card */}
          <div className="card-panel" style={{ padding: '16px', opacity: selectedUnit ? 1 : 0.5, pointerEvents: selectedUnit ? 'auto' : 'none' }}>
            <h3 className="section-title">Evidence and discrepancies</h3>
            
            {selectedUnit?.status !== 'Compliant' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px', marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                  <span style={{ color: '#1E293B', fontWeight: 500 }}>Potential Encroachment Detected</span>
                  <span className="badge badge-warning">Review</span>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: '#10B981', margin: '12px 0' }}>No active conflicts found.</div>
            )}

            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              Spatial relationships
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.7rem', padding: '3px 6px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 600 }}>
                CONTAINS
              </span>
              <span style={{ fontSize: '0.7rem', padding: '3px 6px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 600 }}>
                LINKED_TO
              </span>
              {selectedUnit?.status !== 'Compliant' && (
                <span style={{ fontSize: '0.7rem', padding: '3px 6px', borderRadius: '4px', backgroundColor: '#DC2626', color: '#FFFFFF', fontWeight: 600 }}>
                  CONFLICTS_WITH
                </span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>
                Reviewer comments
              </label>
              <textarea
                rows={3}
                className="form-input"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter formal verification notes..."
                style={{ fontSize: '0.78rem', marginBottom: '12px' }}
              />
            </div>

            {/* Decision Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setActionChoice('APPROVE')}
                className={actionChoice === 'APPROVE' ? 'btn-primary' : 'btn-secondary'}
                style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '6px 8px' }}
              >
                APPROVE
              </button>
              <button
                type="button"
                onClick={() => setActionChoice('MODIFY')}
                className={actionChoice === 'MODIFY' ? 'btn-primary' : 'btn-secondary'}
                style={{
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  padding: '6px 8px',
                  backgroundColor: actionChoice === 'MODIFY' ? '#0D7A68' : '#FFFFFF',
                  color: actionChoice === 'MODIFY' ? '#FFFFFF' : '#334155',
                }}
              >
                MODIFY
              </button>
              <button
                type="button"
                onClick={() => setActionChoice('REJECT')}
                className={actionChoice === 'REJECT' ? 'btn-primary' : 'btn-outline-danger'}
                style={{
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  padding: '6px 8px',
                  backgroundColor: actionChoice === 'REJECT' ? '#DC2626' : '#FFFFFF',
                  color: actionChoice === 'REJECT' ? '#FFFFFF' : '#DC2626',
                }}
              >
                REJECT
              </button>
            </div>
          </div>

          {/* Decision Confirmation Card */}
          <div className="card-panel" style={{ padding: '16px', opacity: selectedUnit ? 1 : 0.5, pointerEvents: selectedUnit ? 'auto' : 'none' }}>
            <h3 className="section-title">Decision confirmation</h3>
            <p style={{ fontSize: '0.78rem', color: '#475569', margin: '8px 0 16px' }}>
              Submit {actionChoice} for {selectedUnit?.unit_identifier}? This records a human review decision and does not create an authoritative legal record.
            </p>

            {decisionConfirmed ? (
              <div style={{
                backgroundColor: '#D1FAE5',
                color: '#065F46',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <CheckCircle size={16} />
                Decision recorded & signed to immutable log.
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button className="btn-secondary" style={{ fontSize: '0.78rem' }} onClick={() => setComments('')}>
                  Cancel
                </button>
                <button className="btn-primary" style={{ fontSize: '0.78rem' }} onClick={submitDecision} disabled={submitting}>
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : 'Confirm decision'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
