import React, { useState } from 'react';
import { Search, Maximize2, Box, AlertTriangle, ArrowRight, Eye, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ConflictGraphPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('CONFLICTS_WITH');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = [
    'ALL',
    'ABOVE',
    'BELOW',
    'ADJACENT',
    'CONTAINS',
    'INTERSECTS',
    'CONFLICTS_WITH',
    'LINKED_TO',
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#0D7A68', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
            SPATIAL RELATIONSHIPS
          </div>
          <h2 className="page-title">Spatial conflict graph</h2>
          <p className="page-subtitle">Explore returned spatial relationships and inspect conflicts linked to candidate units.</p>
        </div>
        <button className="btn-secondary" style={{ padding: '6px', borderRadius: '6px' }}>
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Search & Relationship Filter Bar */}
      <div className="card-panel" style={{ padding: '10px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 10, top: 10 }} />
          <input
            type="text"
            placeholder="Find entity or identifier"
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '30px', fontSize: '0.78rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748B', marginRight: '4px' }}>Relationship</span>
          {filterOptions.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  backgroundColor: isActive ? '#0D7A68' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  border: isActive ? '1px solid #0D7A68' : '1px solid #E2E8F0',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Graph & Sidebar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        {/* Left: Interactive Canvas Viewport */}
        <div className="viewport-dark" style={{ minHeight: '520px', padding: '20px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>
            <span>RETURNED RELATIONSHIP GRAPH</span>
            <span>7 entities · 8 relationships</span>
          </div>

          {/* SVG Graph Visualization */}
          <div style={{ position: 'relative', width: '100%', height: '440px' }}>
            <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
              {/* Edge lines */}
              {/* PCL-0847 to BLD-0847 */}
              <line x1="180" y1="120" x2="360" y2="90" stroke="#38BDF8" strokeWidth="1.5" />
              {/* BLD-0847 to PU-018 */}
              <line x1="360" y1="90" x2="480" y2="180" stroke="#818CF8" strokeWidth="1.5" />
              {/* BLD-0847 to INF-12 */}
              <line x1="360" y1="90" x2="280" y2="320" stroke="#64748B" strokeWidth="1.5" />
              {/* PU-018 to C-004 (CONFLICTS_WITH) */}
              <line x1="480" y1="180" x2="560" y2="90" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 4" />
              {/* PU-018 to FL-L3 (INTERSECTS) */}
              <line x1="480" y1="180" x2="410" y2="320" stroke="#F59E0B" strokeWidth="2" />
              {/* PU-018 to EV-01 */}
              <line x1="480" y1="180" x2="560" y2="350" stroke="#64748B" strokeWidth="1.5" />

              {/* Edge text labels */}
              <text x="250" y="100" fill="#94A3B8" fontSize="10" fontWeight="600">CONTAINS</text>
              <text x="430" y="130" fill="#94A3B8" fontSize="10" fontWeight="600">LINKED_TO</text>
              <text x="540" y="135" fill="#F87171" fontSize="10" fontWeight="700">CONFLICTS_WITH</text>
              <text x="430" y="245" fill="#FBBF24" fontSize="10" fontWeight="600">INTERSECTS</text>
              <text x="520" y="260" fill="#94A3B8" fontSize="10" fontWeight="600">LINKED_TO</text>
              <text x="290" y="210" fill="#94A3B8" fontSize="10" fontWeight="600">CONTAINS</text>
            </svg>

            {/* Nodes */}
            {/* Node 1: PCL-0847 */}
            <div style={{
              position: 'absolute',
              left: '120px',
              top: '100px',
              backgroundColor: 'rgba(13, 122, 104, 0.25)',
              border: '1px solid #0D7A68',
              borderRadius: '6px',
              padding: '8px 12px',
              textAlign: 'center',
              color: '#FFFFFF',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>PCL-0847</div>
              <div style={{ fontSize: '0.65rem', color: '#99DDD3' }}>Parcel / ULPIN reference</div>
            </div>

            {/* Node 2: BLD-0847 */}
            <div style={{
              position: 'absolute',
              left: '320px',
              top: '70px',
              backgroundColor: 'rgba(2, 132, 199, 0.25)',
              border: '1px solid #0284C7',
              borderRadius: '6px',
              padding: '8px 12px',
              textAlign: 'center',
              color: '#FFFFFF',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>BLD-0847</div>
              <div style={{ fontSize: '0.65rem', color: '#93C5FD' }}>Building</div>
            </div>

            {/* Node 3: PU-018 (Active/Focused) */}
            <div style={{
              position: 'absolute',
              left: '430px',
              top: '160px',
              backgroundColor: 'rgba(99, 102, 241, 0.35)',
              border: '2px solid #818CF8',
              boxShadow: '0 0 15px rgba(129, 140, 248, 0.5)',
              borderRadius: '8px',
              padding: '10px 16px',
              textAlign: 'center',
              color: '#FFFFFF',
              zIndex: 10,
            }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>PU-018</div>
              <div style={{ fontSize: '0.68rem', color: '#C7D2FE' }}>PropertyUnit3D</div>
            </div>

            {/* Node 4: C-004 (Conflict) */}
            <div style={{
              position: 'absolute',
              left: '520px',
              top: '70px',
              backgroundColor: 'rgba(220, 38, 38, 0.3)',
              border: '1px solid #DC2626',
              borderRadius: '6px',
              padding: '8px 12px',
              textAlign: 'center',
              color: '#FFFFFF',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FCA5A5' }}>C-004</div>
              <div style={{ fontSize: '0.65rem', color: '#F87171' }}>Conflict</div>
            </div>

            {/* Node 5: INF-12 */}
            <div style={{
              position: 'absolute',
              left: '240px',
              top: '300px',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid #475569',
              borderRadius: '6px',
              padding: '8px 12px',
              textAlign: 'center',
              color: '#FFFFFF',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>INF-12</div>
              <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>InfrastructureAsset</div>
            </div>

            {/* Node 6: FL-L3 */}
            <div style={{
              position: 'absolute',
              left: '380px',
              top: '300px',
              backgroundColor: 'rgba(217, 119, 6, 0.25)',
              border: '1px solid #D97706',
              borderRadius: '6px',
              padding: '8px 12px',
              textAlign: 'center',
              color: '#FFFFFF',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FDE68A' }}>FL-L3</div>
              <div style={{ fontSize: '0.65rem', color: '#FCD34D' }}>Floor</div>
            </div>

            {/* Node 7: EV-01 */}
            <div style={{
              position: 'absolute',
              left: '520px',
              top: '330px',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid #475569',
              borderRadius: '6px',
              padding: '8px 12px',
              textAlign: 'center',
              color: '#FFFFFF',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>EV-01</div>
              <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>EasementVolume</div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Selected Node & Detected Conflicts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Selected Node Card */}
          <div className="card-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="section-title">Selected node</span>
              <span className="badge badge-warning">Pending review</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '14px' }}>
              Currently focused graph entity
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#EDE9FE', color: '#6D28D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box size={18} />
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0F172A' }}>PropertyUnit3D</span>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              CONNECTED ENTITIES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: '#1E293B' }}>FL-L3</span>
                <span style={{ color: '#64748B' }}>via CONTAINS</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: '#1E293B' }}>PCL-0847</span>
                <span style={{ color: '#64748B' }}>via LINKED_TO</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: '#DC2626' }}>C-004</span>
                <span style={{ color: '#DC2626' }}>via CONFLICTS_WITH</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-secondary" style={{ flex: 1, fontSize: '0.78rem' }} onClick={() => navigate('/property-3d')}>
                Open in 3D explorer
              </button>
              <button className="btn-primary" style={{ flex: 1, fontSize: '0.78rem' }} onClick={() => navigate('/verification')}>
                Open review
              </button>
            </div>
          </div>

          {/* Detected Conflicts Card */}
          <div className="card-panel">
            <h3 className="section-title">Detected conflicts</h3>
            <p className="section-desc" style={{ marginBottom: '14px' }}>Returned conflicts linked to candidate units</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Conflict 1 */}
              <div style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FEF3C7',
                borderRadius: '6px',
                padding: '10px 12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#92400E' }}>C-004</span>
                  <span className="badge badge-warning">Review</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#78350F', marginBottom: '6px' }}>
                  Candidate volume intersects infrastructure corridor
                </div>
                <div style={{ fontSize: '0.72rem', color: '#B45309' }}>
                  📐 Offset 1.6 m
                </div>
              </div>

              {/* Conflict 2 */}
              <div style={{
                backgroundColor: '#F0F9FF',
                border: '1px solid #E0F2FE',
                borderRadius: '6px',
                padding: '10px 12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0369A1' }}>C-002</span>
                  <span className="badge badge-teal">Warning</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#0C4A6E', marginBottom: '6px' }}>
                  Vertical extent exceeds floor schedule range
                </div>
                <div style={{ fontSize: '0.72rem', color: '#0284C7' }}>
                  📐 Offset 0.4 m
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
