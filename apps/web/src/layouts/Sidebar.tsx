import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  UploadCloud,
  Workflow,
  Box,
  Layers,
  Network,
  FileCheck2,
  Compass,
  UserCheck,
  Building2,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--sidebar-border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '20px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid var(--sidebar-border)',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          backgroundColor: '#0D7A68',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Layers size={18} color="#FFFFFF" />
        </div>
        <div>
          <h1 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            Salaahkaar
          </h1>
          <p style={{ fontSize: '0.68rem', color: '#64748B', lineHeight: 1.2, marginTop: '2px' }}>
            Defining Property in Three Dimensions.
          </p>
        </div>
      </div>

      {/* Navigation Sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Section 1: WORKFLOW */}
        <div>
          <div style={{ padding: '4px 10px', fontSize: '0.68rem', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            WORKFLOW
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
            <NavItem to="/app" icon={<LayoutDashboard size={16} />} label="Overview" />
            <NavItem to="/app/projects" icon={<FolderGit2 size={16} />} label="Projects" />
            <NavItem to="/app/data-intake" icon={<UploadCloud size={16} />} label="Data Intake" />
            <NavItem to="/app/processing" icon={<Workflow size={16} />} label="Processing Pipeline" />
          </div>
        </div>

        {/* Section 2: SPATIAL VERIFICATION */}
        <div>
          <div style={{ padding: '4px 10px', fontSize: '0.68rem', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            SPATIAL VERIFICATION
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
            <NavItem to="/app/property-3d" icon={<Box size={16} />} label="3D Property Explorer" />
            <NavItem to="/app/reconciliation" icon={<Layers size={16} />} label="Physical-to-Legal Reconciliation" />
            <NavItem to="/app/conflict-graph" icon={<Network size={16} />} label="Spatial Conflict Graph" />
            <NavItem to="/app/evidence" icon={<FileCheck2 size={16} />} label="Evidence and Reports" />
            <NavItem to="/app/easements" icon={<Compass size={16} />} label="Easement Mapper" />
          </div>
        </div>

        {/* Section 3: REVIEW */}
        <div>
          <div style={{ padding: '4px 10px', fontSize: '0.68rem', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            REVIEW
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
            <NavItem to="/app/verification" icon={<UserCheck size={16} />} label="Human Verification" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '14px 18px',
        borderTop: '1px solid var(--sidebar-border)',
        fontSize: '0.75rem',
        color: '#64748B',
      }}>
        Controlled sample project
      </div>
    </aside>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '0.82rem',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? '#FFFFFF' : '#94A3B8',
        backgroundColor: isActive ? 'var(--sidebar-item-active-bg)' : 'transparent',
        textDecoration: 'none',
        transition: 'all 0.15s',
      })}
    >
      <span style={{ opacity: 0.85 }}>{icon}</span>
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
    </NavLink>
  );
};
