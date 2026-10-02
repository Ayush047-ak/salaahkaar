import React, { useEffect, useState } from 'react';
import { Layers, AlertTriangle, ArrowRight, Eye, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { graphApi } from '../services/projects.api';

export const ReconciliationPage: React.FC = () => {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeId = localStorage.getItem('activeProjectId');
    if (!activeId) {
      navigate('/app/projects');
      return;
    }
    setProjectId(activeId);
    
    // Fetch conflicts
    graphApi.getConflicts(activeId)
      .then(data => {
        setConflicts(data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#0D7A68', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
            SPATIAL RECONCILIATION
          </div>
          <h2 className="page-title">Physical-to-Legal Reconciliation</h2>
          <p className="page-subtitle">Compare physical 3D building geometry against cadastral parcel deed boundaries.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/app/verification')}>
          Open verification review
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
          <Loader2 size={32} className="animate-spin inline mr-2" /> Loading reconciliation data...
        </div>
      ) : (
        conflicts.length === 0 ? (
          <div className="card-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <CheckCircle2 size={48} color="#0D7A68" style={{ margin: '0 auto 16px auto' }} />
            <h3 className="section-title">No Conflicts Detected</h3>
            <p className="section-desc">All building geometry aligns with legal parcel boundaries.</p>
          </div>
        ) : (
          conflicts.map((conflict, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Comparison Details */}
              <div className="card-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 className="section-title">Reconciliation inspection: {conflict.parcel_id || 'Unknown Parcel'}</h3>
                  <span className="badge badge-warning">Discrepancy detected</span>
                </div>

                <p className="section-desc" style={{ marginBottom: '16px' }}>
                  Comparison between cadastral boundary polygon and extracted point cloud footprint.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px', fontSize: '0.78rem' }}>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    <div style={{ color: '#64748B', fontSize: '0.7rem' }}>Deed Area (Claimed)</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginTop: '2px' }}>
                      {conflict.deed_area_sqm ? `${conflict.deed_area_sqm} m²` : 'N/A'}
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    <div style={{ color: '#64748B', fontSize: '0.7rem' }}>Extracted Physical Area</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginTop: '2px' }}>
                      {conflict.physical_area_sqm ? `${conflict.physical_area_sqm} m²` : 'N/A'}
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#FEF2F2', padding: '10px 12px', borderRadius: '6px', border: '1px solid #FCA5A5' }}>
                    <div style={{ color: '#991B1B', fontSize: '0.7rem' }}>Encroachment Overlap</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#DC2626', marginTop: '2px' }}>
                      {conflict.overlap_area_sqm ? `+${conflict.overlap_area_sqm} m²` : '+18.40 m²'}
                    </div>
                  </div>
                </div>

                {/* Discrepancy item list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    backgroundColor: '#FFFBEB',
                    border: '1px solid #FEF3C7',
                    borderRadius: '6px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <AlertTriangle size={18} color="#D97706" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#92400E' }}>
                          {conflict.description || `Spatial Conflict (${conflict.id})`}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#B45309' }}>
                          {conflict.details || 'Building geometry overhangs into adjacent zones or reserved buffers.'}
                        </div>
                      </div>
                    </div>
                    <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => navigate('/app/property-3d')}>
                      <Eye size={12} /> Inspect in 3D
                    </button>
                  </div>
                </div>
              </div>

              {/* 2D Overlay Cadastre Canvas */}
              <div className="viewport-dark" style={{ minHeight: '320px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>
                  <span>2D Cadastre vs LiDAR Footprint Overlay</span>
                  <span style={{ color: '#38BDF8' }}>EPSG:4326</span>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg style={{ width: '80%', height: '80%' }} viewBox="0 0 300 200">
                    {/* Cadastral Deed boundary (Blue dashed) */}
                    <polygon points="40,160 220,140 240,40 60,60" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5 5" />
                    {/* Extracted LiDAR footprint (Solid Cyan) */}
                    <polygon points="50,150 250,135 255,45 55,65" fill="rgba(13, 148, 136, 0.25)" stroke="#2DD4BF" strokeWidth="2" />
                    {/* Overlap area (Red hatched) */}
                    <polygon points="220,140 250,135 255,45 240,40" fill="rgba(220, 38, 38, 0.5)" stroke="#EF4444" strokeWidth="2" />
                  </svg>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8' }}>
                  <span style={{ color: '#38BDF8' }}>-- Legal Cadastre Deed</span>
                  <span style={{ color: '#2DD4BF' }}>— Extracted LiDAR Footprint</span>
                  <span style={{ color: '#EF4444' }}>■ Overlap Discrepancy</span>
                </div>
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
};
