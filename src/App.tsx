import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RedesignLanding } from './pages/redesign/RedesignLanding';

/** Route table, router-agnostic so tests can mount it in a MemoryRouter.
    index.tsx provides the BrowserRouter.
    Legacy variant paths (/sales /teams /never-blank) may be linked from old
    ads/emails — keep them resolving to the landing page. */
export const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<RedesignLanding />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
