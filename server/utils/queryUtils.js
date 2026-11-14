/**
 * Safe MongoDB query helpers for search regex escaping and sort field allowlisting.
 */

export const MAX_SEARCH_QUERY_LENGTH = 100;

export const ADMIN_DOCUMENT_SORT_FIELDS = Object.freeze([
  'createdAt',
  'updatedAt',
  'publishedAt',
  'title',
  'status',
  'viewCount',
  'downloadCount',
]);

/**
 * Escape all special regular expression characters to prevent
 * malformed-regex 500 errors, regex injection, and ReDoS attacks.
 */
export const escapeRegex = (value = '') =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Validate and sanitize a search query string.
 * Rejects non-string inputs (e.g. object injection) and overly long queries.
 */
export const parseSearchQuery = (rawQuery, maxLength = MAX_SEARCH_QUERY_LENGTH) => {
  if (rawQuery === undefined || rawQuery === null || rawQuery === '') {
    return { valid: true, term: '', regexPattern: '' };
  }

  if (typeof rawQuery !== 'string') {
    return {
      valid: false,
      message: 'Search query must be a plain text string.',
    };
  }

  const trimmed = rawQuery.trim();
  if (!trimmed) {
    return { valid: true, term: '', regexPattern: '' };
  }

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      message: `Search query cannot exceed ${maxLength} characters.`,
    };
  }

  return {
    valid: true,
    term: trimmed,
    regexPattern: escapeRegex(trimmed),
  };
};

/**
 * Parse and strictly allowlist sort parameters (string like "-createdAt" or
 * single-key plain object like { title: 1 }). Any invalid field or direction
 * safely falls back to defaultSort.
 */
export const parseAllowedSort = (
  rawSort,
  allowedFields = ADMIN_DOCUMENT_SORT_FIELDS,
  defaultSort = { createdAt: -1 }
) => {
  if (!rawSort) {
    return { ...defaultSort };
  }

  if (typeof rawSort === 'string') {
    const trimmed = rawSort.trim();
    if (!trimmed) return { ...defaultSort };

    const isDesc = trimmed.startsWith('-');
    const field = isDesc || trimmed.startsWith('+') ? trimmed.slice(1) : trimmed;

    if (allowedFields.includes(field)) {
      return { [field]: isDesc ? -1 : 1 };
    }
    return { ...defaultSort };
  }

  if (typeof rawSort === 'object' && !Array.isArray(rawSort)) {
    const keys = Object.keys(rawSort);
    if (keys.length !== 1) {
      return { ...defaultSort };
    }

    const field = keys[0];
    if (!allowedFields.includes(field)) {
      return { ...defaultSort };
    }

    const dir = rawSort[field];
    if (dir === 1 || dir === '1' || dir === 'asc') {
      return { [field]: 1 };
    }
    if (dir === -1 || dir === '-1' || dir === 'desc') {
      return { [field]: -1 };
    }
  }

  return { ...defaultSort };
};

export default {
  MAX_SEARCH_QUERY_LENGTH,
  ADMIN_DOCUMENT_SORT_FIELDS,
  escapeRegex,
  parseSearchQuery,
  parseAllowedSort,
};

