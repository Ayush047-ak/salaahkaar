import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Package, AlertTriangle, CheckCircle, Layers, Building, Workflow, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../services/projects.api';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectId = localStorage.getItem('activeProjectId');
    if (!projectId) {
      navigate('/app/projects');
      return;
    }

    projectsApi.getStatus(projectId)
      .then(data => {
        setStats(data);
      })
      .catch(err => console.error("Failed to load project stats", err))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px', color: '#64748B' }}>
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 className="page-title">{stats?.name || 'Workspace overview'}</h2>
          <p className="page-subtitle">3D spatial property reconciliation, conflict detection and human verification workbench.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={() => navigate('/app/data-intake')}>
            <Sparkles size={15} />
            Data Intake
          </button>
          <button className="btn-secondary" onClick={() => navigate('/app/property-3d')}>
            3D Property Explorer
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="card-panel">
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>REGISTERED DATASETS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '4px 0' }}>{stats?.stage === 'DATA_INTAKE' ? '1' : '3'}</div>
          <div style={{ fontSize: '0.75rem', color: '#0D7A68', fontWeight: 600 }}>LAS, GeoJSON & CSV</div>
        </div>
        <div className="card-panel">
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>CANDIDATE 3D UNITS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '4px 0' }}>{stats?.totalParcels || 0}</div>
          <div style={{ fontSize: '0.75rem', color: '#0284C7', fontWeight: 600 }}>Parcels detected</div>
        </div>
        <div className="card-panel">
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>DETECTED CONFLICTS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#DC2626', margin: '4px 0' }}>{stats?.conflictsCount?.total || 0}</div>
          <div style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600 }}>{stats?.conflictsCount?.open || 0} Open</div>
        </div>
        <div className="card-panel">
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>PENDING REVIEWS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#D97706', margin: '4px 0' }}>{stats?.conflictsCount?.open || 0}</div>
          <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 600 }}>Action Required</div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div className="card-panel" style={{ cursor: 'pointer' }} onClick={() => navigate('/app/processing')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#E6F6F3', color: '#0D7A68', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Workflow size={18} />
            </div>
            <h3 className="section-title">Processing Pipeline</h3>
          </div>
          <p className="section-desc" style={{ marginBottom: '16px' }}>
            Inspect automated point cloud filtering, footprint extraction and height normalization.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#0D7A68', fontWeight: 600 }}>
            Inspect pipeline <ArrowRight size={14} />
          </div>
        </div>

        <div className="card-panel" style={{ cursor: 'pointer' }} onClick={() => navigate('/app/property-3d')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={18} />
            </div>
            <h3 className="section-title">3D Property Explorer</h3>
          </div>
          <p className="section-desc" style={{ marginBottom: '16px' }}>
            Explore 3D volumetric floors, vertical extrusions and candidate units in Cesium/WebGL.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#0284C7', fontWeight: 600 }}>
            Launch 3D viewer <ArrowRight size={14} />
          </div>
        </div>

        <div className="card-panel" style={{ cursor: 'pointer' }} onClick={() => navigate('/app/verification')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={18} />
            </div>
            <h3 className="section-title">Verification Workbench</h3>
          </div>
          <p className="section-desc" style={{ marginBottom: '16px' }}>
            Adjudicate candidate units, review spatial evidence and record explicit decisions.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#D97706', fontWeight: 600 }}>
            Open review queue <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

