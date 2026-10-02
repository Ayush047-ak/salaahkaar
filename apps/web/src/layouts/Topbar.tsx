import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, ChevronDown } from 'lucide-react';

export const Topbar: React.FC = () => {
  const location = useLocation();

  const getBreadcrumbs = () => {
    switch (location.pathname) {
      case '/data-intake':
        return ['Projects', 'Data Intake'];
      case '/processing':
        return ['Salaahkaar', 'Processing Pipeline'];
      case '/property-3d':
        return ['Projects', 'Controlled sample', '3D Property Explorer'];
      case '/conflict-graph':
        return ['Projects', 'Demo property dataset', 'Spatial Conflict Graph'];
      case '/verification':
        return ['Human Verification', 'Workbench'];
      case '/reconciliation':
        return ['Projects', 'Physical-to-Legal Reconciliation'];
      case '/evidence':
        return ['Projects', 'Evidence and Reports'];
      case '/easements':
        return ['Projects', 'Easement Mapper'];
      default:
        return ['Salaahkaar', 'Workspace'];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header style={{
      height: '52px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      flexShrink: 0,
    }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748B' }}>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb}>
            {idx > 0 && <span style={{ color: '#CBD5E1' }}>›</span>}
            <span style={{
              fontWeight: idx === breadcrumbs.length - 1 ? 600 : 400,
              color: idx === breadcrumbs.length - 1 ? '#0F172A' : '#64748B',
            }}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {/* Processing status pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.78rem',
          color: '#334155',
          background: '#F1F5F9',
          padding: '4px 10px',
          borderRadius: '9999px',
          border: '1px solid #E2E8F0',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981' }} />
          <span>Processing status: Ready</span>
        </div>

        {/* Notification Bell */}
        <button style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Bell size={16} />
        </button>

        {/* User profile dropdown badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '6px',
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#E2E8F0',
            color: '#334155',
            fontWeight: 600,
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            AK
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#334155' }}>
            Demo reviewer
          </span>
          <ChevronDown size={14} color="#64748B" />
        </div>
      </div>
    </header>
  );
};
