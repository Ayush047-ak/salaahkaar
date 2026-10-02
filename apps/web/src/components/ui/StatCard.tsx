import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
}) => {
  return (
    <Card interactive>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </p>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '8px 0 4px', letterSpacing: '-0.02em' }}>
            {value}
          </h3>
          {subtitle && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{subtitle}</p>
          )}
          {trend && (
            <span style={{ fontSize: '0.8rem', color: trend.isPositive ? '#34D399' : '#FB7185', marginTop: '6px', display: 'inline-block' }}>
              {trend.value}
            </span>
          )}
        </div>
        <div style={{
          background: 'rgba(56, 189, 248, 0.1)',
          padding: '12px',
          borderRadius: '12px',
          color: '#38BDF8',
          border: '1px solid rgba(56, 189, 248, 0.2)',
        }}>
          {icon}
        </div>
      </div>
    </Card>
  );
};
