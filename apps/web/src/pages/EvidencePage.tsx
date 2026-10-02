import React from 'react';
import { FileText, FileCheck2, Download, Eye, CheckCircle2 } from 'lucide-react';

export const EvidencePage: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#0D7A68', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
            EVIDENCE & REPORTS
          </div>
          <h2 className="page-title">Evidence & Provenance Vault</h2>
          <p className="page-subtitle">Inspect source data provenance, registered deed references, and cryptographic audit records.</p>
        </div>
        <button className="btn-secondary">
          <Download size={15} /> Export Audit Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Evidence Card 1 */}
        <div className="card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={20} color="#0D7A68" />
              <h3 className="section-title">Deed Registry Reference: DEED-DL-2018-8831</h3>
            </div>
            <span className="badge badge-ready">Authoritative Record</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Primary Grantee / Owner:</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>Aarav Sharma</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Deeded Area:</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>450.00 m²</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Registration Date:</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>14 October 2018</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>ULPIN Identifier:</span>
              <span style={{ fontWeight: 600, color: '#0284C7' }}>DL-NZM-PCL-0847</span>
            </div>
          </div>
        </div>

        {/* Evidence Card 2 */}
        <div className="card-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileCheck2 size={20} color="#0284C7" />
              <h3 className="section-title">LiDAR Survey Manifest: nizamuddin_pointcloud.las</h3>
            </div>
            <span className="badge badge-ready">Processed LAS 1.4</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Survey Platform:</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>UAV Aerial LiDAR Survey</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Acquisition Timestamp:</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>12 March 2024</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Points Processed:</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>145,200 points</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Integrity Hash:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#0D7A68' }}>0x8f3c9e917bc12d8a43f8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
