/**
 * Utility to convert string into a URL-friendly slug.
 * 
 * @param {string} text - Input text
 * @returns {string} - URL-safe slug
 */
export const slugify = (text = '') => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters (except spaces & hyphens)
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
};

/**
 * Generate a unique slug for a given Mongoose Model.
 * Appends a numeric suffix (-1, -2, ...) if a collision is detected.
 * 
 * @param {import('mongoose').Model} Model - Target Mongoose model
 * @param {string} baseText - Text to convert to slug
 * @param {import('mongoose').Types.ObjectId|string} [excludeId] - Optional ID to exclude (during updates)
 * @returns {Promise<string>}
 */
export const generateUniqueSlug = async (Model, baseText, excludeId = null) => {
  const baseSlug = slugify(baseText) || 'item';
  let candidateSlug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug: candidateSlug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await Model.findOne(query).select('_id').lean();
    if (!existing) {
      return candidateSlug;
    }

    candidateSlug = `${baseSlug}-${counter}`;
    counter++;
  }
};

export default { slugify, generateUniqueSlug };

