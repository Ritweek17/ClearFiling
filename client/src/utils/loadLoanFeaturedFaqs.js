export async function loadLoanFeaturedFaqs(slug, loadContent = () => import('../data/loanServiceContent.js')) {
  try {
    const { LOAN_SERVICE_CONTENT } = await loadContent();
    return LOAN_SERVICE_CONTENT[slug]?.faqReference || null;
  } catch {
    return null;
  }
}
