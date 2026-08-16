import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import RedesignLanding from './RedesignLanding';

const CWS =
  'https://chromewebstore.google.com/detail/wingscript/mnfaookgldbingbnhalfedkajgagnijp';
const TEAM_TRIAL = 'https://app.wingscript.com/admin?create=1';
const PILOT_MAILTO = 'mailto:hello@wingscript.com?subject=wingscript%20team%20pilot';

describe('landing copy — 2026-08-15 handoff rev', () => {
  beforeEach(() => {
    render(<RedesignLanding />);
  });

  test('the hero leads with the on-every-call headline', () => {
    expect(
      screen.getByRole('heading', { level: 1, name: /on every call\. any dialer\. live\./i })
    ).toBeInTheDocument();
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

  test('the ramp-the-floor track prices both seat roles, not a flat per-seat rate', () => {
    expect(
      screen.getByText('/manager seat · $19/member seat · no platform fee')
    ).toBeInTheDocument();
    expect(screen.queryByText('/seat/mo · no platform fee')).not.toBeInTheDocument();
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
    installLinks.forEach((a) => {
      expect(a).toHaveAttribute('href', CWS);
      expect(a).toHaveAttribute('target', '_blank');
      expect(a).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  test('the team trial CTA starts the self-serve org flow', () => {
    expect(screen.getByRole('link', { name: /start a team trial/i })).toHaveAttribute(
      'href',
      TEAM_TRIAL
    );
  });

  test('demo CTAs are buttons that open the request form, not mailto links', () => {
    expect(screen.queryByRole('link', { name: /book a demo/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /book a team demo/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /book a demo/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
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

describe('demo request form', () => {
  const FORM_ENDPOINT = 'https://formspree.io/f/REPLACE_ME';

  const openForm = () =>
    fireEvent.click(screen.getByRole('button', { name: /book a team demo/i }));

  const fillAndSubmit = () => {
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Rep' } });
    fireEvent.change(screen.getByLabelText('Work email'), {
      target: { value: 'jane@acme.com' },
    });
    fireEvent.change(screen.getByLabelText('Team size'), { target: { value: '6–20' } });
    fireEvent.click(screen.getByRole('button', { name: /request a demo/i }));
  };

  beforeEach(() => {
    render(<RedesignLanding />);
  });

  afterEach(() => {
    delete (global as { fetch?: unknown }).fetch;
  });

  test('the closer demo CTA opens a dialog with the three fields', () => {
    openForm();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Work email')).toBeInTheDocument();
    expect(screen.getByLabelText('Team size')).toBeInTheDocument();
  });

  test('escape closes the dialog', () => {
    openForm();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('submitting sends the request to the form service and thanks the visitor', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    (global as { fetch?: unknown }).fetch = fetchMock;
    openForm();
    fillAndSubmit();
    await screen.findByText(/thanks — we'll be in touch/i);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe(FORM_ENDPOINT);
    expect(opts.method).toBe('POST');
    const body = opts.body as FormData;
    expect(body.get('name')).toBe('Jane Rep');
    expect(body.get('email')).toBe('jane@acme.com');
    expect(body.get('team_size')).toBe('6–20');
  });

  test('a failed submit offers the email fallback', async () => {
    (global as { fetch?: unknown }).fetch = jest
      .fn()
      .mockRejectedValue(new Error('network down'));
    openForm();
    fillAndSubmit();
    await screen.findByText(/something went wrong/i);
    expect(screen.getByRole('link', { name: /email us instead/i })).toHaveAttribute(
      'href',
      PILOT_MAILTO
    );
  });
});
