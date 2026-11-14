import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadLoanFeaturedFaqs } from '../src/utils/loadLoanFeaturedFaqs.js';
import { LOAN_SERVICE_CONTENT } from '../src/data/loanServiceContent.js';

describe('featured loan FAQ loader', () => {
  it('returns the selected loan service FAQs', async () => {
    const faqs = await loadLoanFeaturedFaqs('vehicle-loan');
    assert.deepEqual(faqs, LOAN_SERVICE_CONTENT['vehicle-loan'].faqReference);
  });

  it('handles failed content imports without rejecting', async () => {
    const faqs = await loadLoanFeaturedFaqs('vehicle-loan', async () => {
      throw new Error('simulated chunk load failure');
    });
    assert.equal(faqs, null);
  });

  it('returns null for an unknown slug', async () => {
    assert.equal(await loadLoanFeaturedFaqs('missing-loan'), null);
  });
});
