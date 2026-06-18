import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './tailwind.output.css';
import './index.css';
import { LandingPage } from './pages/LandingPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<LandingPage variant="sales" />} />
        <Route path="/sales" element={<LandingPage variant="sales" />} />
        <Route path="/never-blank" element={<LandingPage variant="never-blank" />} />
        <Route path="/teams" element={<LandingPage variant="teams" />} />
        <Route path="*" element={<Navigate to="/sales" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
