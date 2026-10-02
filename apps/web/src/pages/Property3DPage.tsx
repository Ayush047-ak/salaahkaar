import React, { useState, useEffect, useMemo } from 'react';
import { ThreeViewer } from '../components/spatial/ThreeViewer';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Package,
  Building,
  Layers,
  ShieldAlert,
  Send,
  ExternalLink,
  Target,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { graphApi, projectsApi } from '../services/projects.api';

export const Property3DPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Layer toggles
  const [layers, setLayers] = useState({
    parcelBoundary: true,
    buildingMass: true,
    floorPlates: true,
    candidateVolumes: true,
    conflicts: true,
  });

  useEffect(() => {
    const projectId = localStorage.getItem('activeProjectId');
    if (!projectId) {
      navigate('/app/projects');
      return;
    }

    graphApi.getGraph(projectId)
      .then(data => {
        setGraphData(data);
        // Expand parcels by default
        const parcels = data.nodes.filter((n: any) => n.type === 'Parcel');
        setExpandedNodes(new Set(parcels.map((p: any) => p.id)));
      })
      .catch(err => console.error("Failed to load graph", err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Build Hierarchy
  const hierarchy = useMemo(() => {
    const parcels = graphData.nodes.filter(n => n.type === 'Parcel');
    const buildings = graphData.nodes.filter(n => n.type === 'Building');
    const units = graphData.nodes.filter(n => n.type === 'Unit');

    return parcels.map(parcel => {
      const buildingEdges = graphData.edges.filter(e => e.source === parcel.id && e.type === 'CONTAINS_BUILDING');
      const pBuildings = buildingEdges.map(e => buildings.find(b => b.id === e.target)).filter(Boolean);

      return {
        ...parcel,
        children: pBuildings.map(building => {
          const unitEdges = graphData.edges.filter(e => e.source === building.id && e.type === 'CONTAINS_UNIT');
          const bUnits = unitEdges.map(e => units.find(u => u.id === e.target)).filter(Boolean);
          return {
            ...building,
            children: bUnits
          };
        })
      };
    });
  }, [graphData]);

  return (
    <div>
      {/* Page Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 className="page-title">3D Property Explorer</h2>
          <p className="page-subtitle">Inspect linked cadastral evidence, candidate volumes and spatial conflicts.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            <Target size={14} />
            Fit selection
          </button>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            <RotateCcw size={14} />
            Reset view
          </button>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#0D7A68',
            backgroundColor: '#E6F6F3',
            padding: '6px 12px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Package size={14} />
            {graphData.nodes.filter(n => n.type === 'Unit').length} candidates loaded
          </span>
        </div>
      </div>

      {/* 3-Panel Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 310px', gap: '16px', height: 'calc(100vh - 170px)', minHeight: '560px' }}>
        {/* Panel 1: Left Panel (Entities and Layers) */}
        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', padding: '16px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Entities and layers</span>
          </div>

          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 10, top: 10 }} />
            <input
              type="text"
              placeholder="Search entities"
              className="form-input"
              style={{ paddingLeft: '30px', fontSize: '0.78rem' }}
            />
          </div>

          {/* Tree Structure */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B' }}>
                <Loader2 size={16} className="animate-spin" /> Loading topology...
              </div>
            ) : (
              hierarchy.map(parcel => (
                <div key={parcel.id}>
                  <div 
                    onClick={(e) => { toggleExpand(parcel.id, e); setSelectedEntity(parcel); }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: selectedEntity?.id === parcel.id ? '#0F172A' : '#0D7A68', fontWeight: 600, padding: '4px 0', cursor: 'pointer', backgroundColor: selectedEntity?.id === parcel.id ? '#F1F5F9' : 'transparent', borderRadius: '4px' }}
                  >
                    {expandedNodes.has(parcel.id) ? <ChevronDown size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> : <ChevronRight size={14} style={{ marginTop: '2px', flexShrink: 0 }} />}
                    <Package size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div>Parcel {parcel.label}</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 400 }}>
                        {parcel.properties?.ownerName || 'Unknown owner'}
                      </div>
                    </div>
                  </div>

                  {expandedNodes.has(parcel.id) && parcel.children.map((building: any) => (
                    <div key={building.id} style={{ paddingLeft: '18px', marginTop: '4px' }}>
                      <div 
                        onClick={(e) => { toggleExpand(building.id, e); setSelectedEntity(building); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', color: selectedEntity?.id === building.id ? '#0F172A' : '#0284C7', fontWeight: 600, padding: '4px 4px', cursor: 'pointer', backgroundColor: selectedEntity?.id === building.id ? '#F1F5F9' : 'transparent', borderRadius: '4px' }}
                      >
                        {expandedNodes.has(building.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        <Building size={14} />
                        <span>Building {building.label}</span>
                      </div>

                      {expandedNodes.has(building.id) && (
                        <div style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                          {building.children.map((unit: any) => (
                            <div 
                              key={unit.id}
                              onClick={() => setSelectedEntity(unit)}
                              style={{
                                backgroundColor: selectedEntity?.id === unit.id ? '#E6F6F3' : 'transparent',
                                border: selectedEntity?.id === unit.id ? '1px solid #99DDD3' : '1px solid transparent',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                color: selectedEntity?.id === unit.id ? '#0D7A68' : '#64748B',
                                fontWeight: selectedEntity?.id === unit.id ? 600 : 400,
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                              }}>
                              {unit.label} (Floor {unit.properties?.floor})
                            </div>
                          ))}
                          {building.children.length === 0 && <span style={{ color: '#94A3B8', fontSize: '0.7rem', paddingLeft: '8px' }}>No units discovered</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Layer Visibility Toggles */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
              LAYER VISIBILITY
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
              {[
                { label: 'Parcel boundary', key: 'parcelBoundary' as const },
                { label: 'Building mass', key: 'buildingMass' as const },
                { label: 'Floor plates', key: 'floorPlates' as const },
                { label: 'Candidate volumes', key: 'candidateVolumes' as const },
                { label: 'Conflicts', key: 'conflicts' as const },
              ].map(layer => (
                <div key={layer.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#334155' }}>{layer.label}</span>
                  <input
                    type="checkbox"
                    checked={layers[layer.key]}
                    onChange={() => toggleLayer(layer.key)}
                    style={{ accentColor: '#0D7A68', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2: Center 3D Scene Viewport */}
        <div style={{ height: '100%' }}>
          <ThreeViewer selectedEntityId={selectedEntity?.id || null} showConflict={layers.conflicts} />
        </div>

        {/* Panel 3: Right Panel (Selected Entity Details) */}
        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', padding: '18px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Selected entity</span>
          </div>

          {selectedEntity ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', backgroundColor: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                  {selectedEntity.type}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{selectedEntity.id.split('-')[0]}</span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>
                {selectedEntity.label}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '0.78rem' }}>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.7rem' }}>Status</div>
                  <div style={{ color: '#D97706', fontWeight: 600, marginTop: '2px' }}>{selectedEntity.properties?.status || 'Active'}</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.7rem' }}>Type</div>
                  <div style={{ color: '#0F172A', fontWeight: 600, marginTop: '2px' }}>{selectedEntity.properties?.type || selectedEntity.type}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.78rem', marginBottom: '16px' }}>
                {Object.entries(selectedEntity.properties || {}).filter(([k]) => !['status', 'type', 'id'].includes(k)).slice(0, 5).map(([k, v]) => (
                  <div key={k}>
                    <div style={{ color: '#64748B', fontSize: '0.7rem', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div style={{ color: '#0F172A', fontWeight: 600, marginTop: '2px' }}>{String(v)}</div>
                  </div>
                ))}
              </div>

              {selectedEntity.type === 'Unit' && (
                <>
                  <div style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FEE2E2',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    marginBottom: '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#991B1B', marginBottom: '2px' }}>
                      <AlertTriangle size={14} color="#DC2626" /> Spatial analysis note
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7F1D1D' }}>
                      Ensure volume does not exceed established zoning heights.
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                    <button className="btn-primary" onClick={() => navigate('/app/reconciliation')}>
                      Open reconciliation
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/app/conflict-graph')}>
                      <AlertTriangle size={14} color="#D97706" />
                      View conflicts
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/app/verification')}>
                      <Send size={14} />
                      Send to review
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748B', fontSize: '0.8rem' }}>
              Select an entity from the tree to view its properties and actions.
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '12px', fontSize: '0.72rem', color: '#64748B' }}>
        Measured or processed evidence is distinct from proposed candidate representation.
      </div>
    </div>
  );
};

