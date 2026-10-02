import React from 'react';
import { Card } from '../ui/Card';
import { Network, AlertTriangle, ShieldCheck, Box } from 'lucide-react';

export const ConflictGraphView: React.FC = () => {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Topological Conflict Graph</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Neo4j Property-Cadastre Graph (Nodes, Encroachments & Easements)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-danger">1 Encroachment Edge</span>
          <span className="badge badge-warning">1 Easement Restriction</span>
        </div>
      </div>

      {/* Visual interactive graph canvas representation */}
      <div style={{
        background: '#070B12',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '36px',
        minHeight: '340px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
        {/* Node 1 */}
        <div style={{
          background: 'rgba(56, 189, 248, 0.1)',
          border: '2px solid #38BDF8',
          padding: '16px 20px',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: 'var(--glow-sky)',
          zIndex: 2,
        }}>
          <Box size={24} color="#38BDF8" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Khasra 101/A</div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Aarav Sharma (450 m²)</div>
        </div>

        {/* Edge Connector */}
        <div style={{
          flex: 1,
          height: '2px',
          background: 'repeating-linear-gradient(90deg, #F43F5E 0px, #F43F5E 6px, transparent 6px, transparent 12px)',
          position: 'relative',
          margin: '0 16px',
        }}>
          <div style={{
            position: 'absolute',
            top: -24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(244, 63, 94, 0.2)',
            border: '1px solid #F43F5E',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '0.7rem',
            color: '#FB7185',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}>
            ENCROACHES (18.4 m²)
          </div>
        </div>

        {/* Node 2 */}
        <div style={{
          background: 'rgba(244, 63, 94, 0.1)',
          border: '2px solid #F43F5E',
          padding: '16px 20px',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: 'var(--glow-rose)',
          zIndex: 2,
        }}>
          <AlertTriangle size={24} color="#F43F5E" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Khasra 101/B</div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Vikram Mehta (520 m²)</div>
        </div>

        {/* Edge Connector to Easement */}
        <div style={{
          flex: 1,
          height: '2px',
          background: 'repeating-linear-gradient(90deg, #F59E0B 0px, #F59E0B 6px, transparent 6px, transparent 12px)',
          position: 'relative',
          margin: '0 16px',
        }}>
          <div style={{
            position: 'absolute',
            top: -24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid #F59E0B',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '0.7rem',
            color: '#FBBF24',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}>
            EASEMENT_RESTRICTION
          </div>
        </div>

        {/* Node 3 - Easement */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '2px solid #F59E0B',
          padding: '16px 20px',
          borderRadius: '16px',
          textAlign: 'center',
          zIndex: 2,
        }}>
          <Network size={24} color="#F59E0B" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Easement E-501</div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>3.5m Drainage Buffer</div>
        </div>
      </div>
    </Card>
  );
};
