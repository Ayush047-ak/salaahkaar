import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <Card style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#38BDF8' }}>404</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>
          The requested spatial route or parcel layer could not be found.
        </p>
        <Button onClick={() => navigate('/')}>
          Back to Overview
        </Button>
      </Card>
    </div>
  );
};
