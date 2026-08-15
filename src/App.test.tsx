import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

const renderAt = (path: string) =>
  render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </MemoryRouter>
  );

const expectRedesignLanding = () =>
  expect(
    screen.getByRole('heading', { level: 1, name: /on every call\. any dialer\. live\./i })
  ).toBeInTheDocument();

test('the root path serves the redesigned landing page', () => {
  renderAt('/');
  expectRedesignLanding();
});

test.each(['/sales', '/teams', '/never-blank'])(
  'legacy route %s lands on the redesigned landing page',
  (path) => {
    renderAt(path);
    expectRedesignLanding();
  }
);

test('unknown paths fall back to the landing page', () => {
  renderAt('/does-not-exist');
  expectRedesignLanding();
});
