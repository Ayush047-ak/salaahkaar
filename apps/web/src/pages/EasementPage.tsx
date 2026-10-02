import React from 'react';
import { Compass, AlertTriangle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EasementPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#0D7A68', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
            SPATIAL RESTRICTIONS
          </div>
          <h2 className="page-title">Easement Mapper</h2>
          <p className="page-subtitle">Configure 3D volumetric easement corridors, utility buffers, and right-of-way clearances.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/property-3d')}>
          Inspect 3D Easement Volumes
        </button>
      </div>

      <div className="card-panel" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '6px',
              backgroundColor: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Compass size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className="section-title">Easement Volume EV-01: Public Drainage & Infrastructure Corridor</h3>
                <span className="badge badge-warning">Active Restriction</span>
              </div>
              <p className="section-desc" style={{ marginTop: '4px' }}>
                Statutory 3.5-meter buffer required along eastern corridor adjoining PCL-0847.
              </p>

              <div style={{ display: 'flex', gap: '24px', marginTop: '14px', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: '#64748B' }}>Buffer Clearance:</span>
                  <span style={{ fontWeight: 600, color: '#0F172A', marginLeft: '6px' }}>3.50 meters</span>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Encroached Volume:</span>
                  <span style={{ fontWeight: 600, color: '#DC2626', marginLeft: '6px' }}>1.60m intrusion by PU-018</span>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Affected Units:</span>
                  <span style={{ fontWeight: 600, color: '#0F172A', marginLeft: '6px' }}>Floor L3 (PU-018)</span>
                </div>
              </div>
            </div>
          </div>

          <button className="btn-secondary" style={{ fontSize: '0.78rem' }} onClick={() => navigate('/conflict-graph')}>
            View in conflict graph
          </button>
        </div>
      </div>
    </div>
  );
};
