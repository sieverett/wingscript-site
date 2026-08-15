import React from 'react';
import { render, screen } from '@testing-library/react';
import RedesignLanding from './RedesignLanding';

const CWS =
  'https://chromewebstore.google.com/detail/wingscript/mnfaookgldbingbnhalfedkajgagnijp';
const TEAM_TRIAL = 'https://app.wingscript.com/admin?create=1';
const PILOT_MAILTO = 'mailto:hello@wingscript.com?subject=wingscript%20team%20pilot';

describe('landing copy — 2026-08-15 handoff rev', () => {
  beforeEach(() => {
    render(<RedesignLanding />);
  });

  test('pricing is presented as pre-launch', () => {
    expect(screen.getByText('Pre-launch · pricing not live yet')).toBeInTheDocument();
    expect(screen.getByText('Pricing at launch.')).toBeInTheDocument();
  });

  test('pricing subhead explains role-priced team seats and the minute rate', () => {
    expect(
      screen.getByText(/\$39 a manager seat, \$19 a member seat/)
    ).toBeInTheDocument();
    expect(screen.getByText(/~\$0\.10\/min/)).toBeInTheDocument();
  });

  test('the Team tier is role-priced with a 20-seat cap', () => {
    expect(screen.getByText('/manager seat')).toBeInTheDocument();
    expect(screen.getByText('/member seat')).toBeInTheDocument();
    expect(screen.getByText('up to 20 seats')).toBeInTheDocument();
  });

  test('Enterprise starts where Team caps out, at 20+ seats', () => {
    expect(screen.getByText(/20\+ seats, SSO/)).toBeInTheDocument();
  });

  test('the teams track is scoped to 20 reps', () => {
    expect(screen.getByText('For the team · up to 20 reps')).toBeInTheDocument();
  });
});

describe('CTA destinations', () => {
  beforeEach(() => {
    render(<RedesignLanding />);
  });

  test('every install CTA points at the wingscript Chrome Web Store listing', () => {
    const installLinks = [
      ...screen.getAllByRole('link', { name: /add to chrome/i }),
      screen.getByRole('link', { name: /start free/i }),
      screen.getByRole('link', { name: /see it live on a call/i }),
    ];
    installLinks.forEach((a) => expect(a).toHaveAttribute('href', CWS));
  });

  test('the team trial CTA starts the self-serve org flow', () => {
    expect(screen.getByRole('link', { name: /start a team trial/i })).toHaveAttribute(
      'href',
      TEAM_TRIAL
    );
  });

  test('demo CTAs open the team-pilot email', () => {
    expect(screen.getByRole('link', { name: /book a demo/i })).toHaveAttribute(
      'href',
      PILOT_MAILTO
    );
    expect(screen.getByRole('link', { name: /book a team demo/i })).toHaveAttribute(
      'href',
      PILOT_MAILTO
    );
  });

  test('footer links reach the legal pages and monitored mailboxes', () => {
    expect(screen.getByRole('link', { name: 'privacy' })).toHaveAttribute(
      'href',
      '/privacy'
    );
    expect(screen.getByRole('link', { name: 'terms' })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: 'security' })).toHaveAttribute(
      'href',
      'mailto:support@wingscript.com'
    );
    expect(screen.getByRole('link', { name: 'contact' })).toHaveAttribute(
      'href',
      'mailto:hello@wingscript.com'
    );
  });

  test('every Chrome Web Store link on the page is the wingscript listing', () => {
    const storeLinks = screen
      .getAllByRole('link')
      .filter((a) => (a.getAttribute('href') || '').includes('chromewebstore.google.com'));
    expect(storeLinks.length).toBeGreaterThan(0);
    storeLinks.forEach((a) => expect(a).toHaveAttribute('href', CWS));
  });
});
