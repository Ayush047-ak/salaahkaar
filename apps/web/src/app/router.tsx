import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { LandingPage } from '../pages/LandingPage';
import { OverviewPage } from '../pages/OverviewPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { DataIntakePage } from '../pages/DataIntakePage';
import { ProcessingPage } from '../pages/ProcessingPage';
import { Property3DPage } from '../pages/Property3DPage';
import { ReconciliationPage } from '../pages/ReconciliationPage';
import { ConflictGraphPage } from '../pages/ConflictGraphPage';
import { EvidencePage } from '../pages/EvidencePage';
import { EasementPage } from '../pages/EasementPage';
import { VerificationPage } from '../pages/VerificationPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'data-intake', element: <DataIntakePage /> },
      { path: 'processing', element: <ProcessingPage /> },
      { path: 'property-3d', element: <Property3DPage /> },
      { path: 'reconciliation', element: <ReconciliationPage /> },
      { path: 'conflict-graph', element: <ConflictGraphPage /> },
      { path: 'evidence', element: <EvidencePage /> },
      { path: 'easements', element: <EasementPage /> },
      { path: 'verification', element: <VerificationPage /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);
