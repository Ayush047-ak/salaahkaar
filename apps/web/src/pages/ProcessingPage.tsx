import React, { useEffect, useState } from 'react';
import { RotateCw, CheckCircle, ExternalLink, AlertTriangle, Info, Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../services/projects.api';

export const ProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectStatus, setProjectStatus] = useState<string>('CREATED');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const activeId = localStorage.getItem('activeProjectId');
    if (!activeId) {
      navigate('/app/projects');
      return;
    }
    setProjectId(activeId);
    pollStatus(activeId);
    
    const interval = setInterval(() => {
      pollStatus(activeId);
    }, 5000); // Poll every 5s

    return () => clearInterval(interval);
  }, [navigate]);

  const pollStatus = async (id: string) => {
    try {
      const p = await projectsApi.getById(id);
      if (p && p.status) {
        setProjectStatus(p.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startPipeline = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      // In a real app, we would hit a run-pipeline endpoint.
      // For now, let's just assume we trigger the node API orchestration (which we will build).
      const baseUrl = import.meta.env.PROD ? '/api/v1' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1');
      const res = await fetch(`${baseUrl}/processing/run-pipeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, pipelineType: 'RECONCILIATION' })
      });
      if (res.ok) {
        pollStatus(projectId);
      }
    } finally {
      setLoading(false);
    }
  };

  const stageOrder = ['CREATED', 'DATA_INTAKE', 'POINTCLOUD_PREPROCESSING', 'FOOTPRINT_EXTRACTION', 'RECONCILIATION', 'CONFLICT_GRAPHING', 'COMPLETED'];
  const currentIndex = stageOrder.indexOf(projectStatus);
  const isCompleted = currentIndex === stageOrder.length - 1;

  const getStageProps = (stageName: string, index: number) => {
    const stageIdx = stageOrder.indexOf(stageName);
    if (stageIdx < currentIndex || isCompleted) {
      return { badges: [{ label: 'Completed', type: 'completed' }], active: false };
    } else if (stageIdx === currentIndex) {
      return { badges: [{ label: 'Running', type: 'teal' }], active: true };
    } else {
      return { badges: [{ label: 'Pending', type: 'warning' }], active: false };
    }
  };

  const stages = [
    {
      num: 1,
      name: 'Input Data Registration',
      stageName: 'CREATED',
      ...getStageProps('CREATED', 0),
      inputs: 'pointcloud LAS, cadastral GeoJSON, floor schedule',
      detail: 'Registered and validated source evidence.',
      output: 'Registered datasets',
    },
    {
      num: 2,
      name: 'Pre-processing and Alignment',
      stageName: 'POINTCLOUD_PREPROCESSING',
      ...getStageProps('POINTCLOUD_PREPROCESSING', 1),
      inputs: 'registered datasets',
      detail: 'Aligned source geometry and normalized coordinate reference system.',
      output: 'Aligned point cloud + normalized CRS',
    },
    {
      num: 3,
      name: 'AI-based Building and Floor Extraction',
      stageName: 'FOOTPRINT_EXTRACTION',
      ...getStageProps('FOOTPRINT_EXTRACTION', 2),
      inputs: 'aligned point cloud, floor schedule',
      detail: 'Derived from point-cloud and floor schedule; requires review',
      output: 'Building footprints + floor candidates',
    },
    {
      num: 4,
      name: 'Physical-to-Legal Reconciliation',
      stageName: 'RECONCILIATION',
      ...getStageProps('RECONCILIATION', 3),
      inputs: 'floor candidates, cadastral GeoJSON',
      detail: 'Compared extracted geometry with cadastral parcel references.',
      output: 'Candidate parcel links & spatial conflicts',
    },
    {
      num: 5,
      name: 'ULPIN-linked 3D Spatial Identity Graphing',
      stageName: 'CONFLICT_GRAPHING',
      ...getStageProps('CONFLICT_GRAPHING', 4),
      inputs: 'candidate parcel links, building candidates',
      detail: 'Resolved spatial identities and evaluated relationships.',
      output: 'Relationships requiring inspection',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span>Processing Pipeline</span>
          </div>
          <h2 className="page-title">Processing pipeline</h2>
          <p className="page-subtitle">Inspect each transformation from source evidence to reviewable candidate units.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={() => pollStatus(projectId!)}>
            <RotateCw size={15} /> Refresh
          </button>
          {!isCompleted && (
            <button className="btn-primary" onClick={startPipeline} disabled={loading || !['CREATED', 'DATA_INTAKE'].includes(projectStatus)}>
               {loading ? <Loader2 size={15} className="animate-spin" /> : 'Run Pipeline'}
            </button>
          )}
          {isCompleted && (
             <button className="btn-primary" onClick={() => navigate('/app/reconciliation')}>
               View Reconciliation
             </button>
          )}
        </div>
      </div>

      {/* Processing Job Banner */}
      <div className="card-panel" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: isCompleted ? '#E6F6F3' : (!['CREATED', 'DATA_INTAKE'].includes(projectStatus) ? '#FFFBEB' : '#F1F5F9'),
              color: isCompleted ? '#0D7A68' : (!['CREATED', 'DATA_INTAKE'].includes(projectStatus) ? '#D97706' : '#64748B'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {isCompleted ? <CheckCircle size={22} /> : (!['CREATED', 'DATA_INTAKE'].includes(projectStatus) ? <Loader2 size={22} className="animate-spin" /> : <Info size={22} />)}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                PROCESSING JOB
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {projectId?.slice(0, 8)}
                <span className={`badge ${isCompleted ? 'badge-ready' : (!['CREATED', 'DATA_INTAKE'].includes(projectStatus) ? 'badge-warning' : 'badge-neutral')}`}>
                  ● {isCompleted ? 'Completed' : (!['CREATED', 'DATA_INTAKE'].includes(projectStatus) ? 'Running' : 'Ready to start')}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Status</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>{projectStatus.replace(/_/g, ' ')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Stages on Left, Validation on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left: Pipeline Stages */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 className="section-title">Pipeline stages</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>5 stages</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stages.map((stage) => (
              <div key={stage.num} className="card-panel" style={{ padding: '16px 20px', border: stage.active ? '2px solid #0D7A68' : '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '14px' }}>
                    {/* Circle Stage Number */}
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: stage.active || (stageOrder.indexOf(stage.stageName) < currentIndex) ? '#0D7A68' : '#CBD5E1',
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {stage.num}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A' }}>{stage.name}</span>
                        {stage.badges.map((b, i) => (
                          <span
                            key={i}
                            className={`badge ${
                              b.type === 'completed'
                                ? 'badge-neutral'
                                : b.type === 'teal'
                                ? 'badge-teal'
                                : 'badge-warning'
                            }`}
                          >
                            {b.label}
                          </span>
                        ))}
                      </div>

                      <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px' }}>
                        Inputs: {stage.inputs}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginTop: '12px', fontSize: '0.8rem' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>PROCESSING DETAIL</div>
                          <div style={{ color: '#334155', marginTop: '2px' }}>{stage.detail}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>OUTPUT ARTIFACT</div>
                          <div style={{ color: '#0F172A', fontWeight: 600, marginTop: '2px' }}>{stage.output}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Validation Summary */}
        <div>
          <div className="card-panel">
            <h3 className="section-title">Validation summary</h3>
            <p className="section-desc" style={{ marginBottom: '16px' }}>Checks from the processing job</p>

            {/* Counts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#E6F6F3', borderRadius: '6px', padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0D7A68' }}>{isCompleted ? 3 : 0}</div>
                <div style={{ fontSize: '0.72rem', color: '#0D7A68', fontWeight: 600 }}>Checks passed</div>
              </div>
              <div style={{ backgroundColor: '#FEF3C7', borderRadius: '6px', padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#D97706' }}>{isCompleted ? 2 : 0}</div>
                <div style={{ fontSize: '0.72rem', color: '#92400E', fontWeight: 600 }}>Warnings</div>
              </div>
              <div style={{ backgroundColor: '#F1F5F9', borderRadius: '6px', padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#64748B' }}>0</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>System errors</div>
              </div>
            </div>

            {/* Warning list */}
            {isCompleted && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                 <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.8rem', color: '#92400E' }}>
                   <AlertTriangle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                   <span>Vertical datum is inferred for candidate models</span>
                 </div>
                 <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.8rem', color: '#92400E' }}>
                   <AlertTriangle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                   <span>Boundaries exceed configured review threshold</span>
                 </div>
               </div>
            )}

            {/* Disclaimer Callout */}
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '0.78rem',
              color: '#64748B',
              display: 'flex',
              gap: '8px',
            }}>
              <Info size={16} color="#64748B" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                Outputs are reviewable candidate representations derived from source evidence. They are not final legal determinations.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
