import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './tailwind.output.css';
import './index.css';
import { LandingPage } from './pages/LandingPage';

const rootElement = document.getElementById('root') as HTMLElement;

const app = (
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

// react-snap prerenders static HTML into #root at build time. When that content
// is present, hydrate it; otherwise (dev / un-prerendered) do a fresh client render.
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}
