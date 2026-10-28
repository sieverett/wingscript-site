import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResourcesPage } from './ResourcesPage';
import { RESOURCES } from './resources';

const ARTICLE =
  'https://fractionaluplifts.com/knowledge-center/pipedrive-vs-copper-crm-comparison';

describe('resources page', () => {
  beforeEach(() => {
    render(<ResourcesPage />);
  });

  test('introduces the list as guides for small sales teams', () => {
    expect(screen.getByRole('heading', { level: 1, name: 'Resources' })).toBeInTheDocument();
    expect(
      screen.getByText('Guides and comparisons we found useful for small sales teams.')
    ).toBeInTheDocument();
  });

  test("links Fractional Uplifts' Pipedrive vs Copper comparison in a new tab", () => {
    const card = screen.getByRole('link', { name: /pipedrive vs\.? copper/i });
    expect(card).toHaveAttribute('href', ARTICLE);
    expect(card).toHaveAttribute('target', '_blank');
    expect(card.getAttribute('rel')).toMatch(/\bnoopener\b/);
    expect(card).toHaveTextContent('Fractional Uplifts');
  });

  test('every entry in the data array becomes a card', () => {
    expect(RESOURCES.length).toBeGreaterThan(0);
    RESOURCES.forEach((r) => {
      const card = screen.getByRole('link', { name: new RegExp(r.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) });
      expect(card).toHaveAttribute('href', r.href);
      expect(card).toHaveTextContent(r.source);
      expect(card).toHaveTextContent(r.description);
    });
  });

  test('the nav still reaches the Chrome Web Store and the landing sections', () => {
    expect(screen.getByRole('link', { name: /start free/i })).toHaveAttribute(
      'href',
      'https://chromewebstore.google.com/detail/wingscript/mnfaookgldbingbnhalfedkajgagnijp'
    );
    // Nav and footer both carry "pricing"; from /resources each must point back
    // at the landing section, not a same-page fragment that goes nowhere.
    const pricingLinks = screen.getAllByRole('link', { name: 'pricing' });
    expect(pricingLinks).toHaveLength(2);
    pricingLinks.forEach((a) => expect(a).toHaveAttribute('href', '/#pricing'));
  });

  test('the footer carries the same links as the landing page', () => {
    expect(screen.getByRole('link', { name: 'resources' })).toHaveAttribute('href', '/resources');
    expect(screen.getByRole('link', { name: 'privacy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'terms' })).toHaveAttribute('href', '/terms');
  });
});
