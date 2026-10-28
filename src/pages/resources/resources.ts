/* The cards on /resources. Add an entry here; the page renders one card per
   entry. Links are included on their merits — no reciprocal-link or paid
   placement arrangements. */

export interface Resource {
  title: string;
  /** Publisher name as shown on the card. */
  source: string;
  /** One neutral sentence on what the reader gets. */
  description: string;
  href: string;
}

export const RESOURCES: Resource[] = [
  {
    title: 'Pipedrive vs. Copper: Which CRM Is Right for Your B2B Sales Team?',
    source: 'Fractional Uplifts',
    description:
      'A side-by-side of two CRMs small B2B sales teams shortlist: where each one fits, where each falls short, and what they cost.',
    href: 'https://fractionaluplifts.com/knowledge-center/pipedrive-vs-copper-crm-comparison',
  },
];
