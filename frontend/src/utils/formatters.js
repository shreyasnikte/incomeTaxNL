/**
 * Centralized formatting utilities
 * Supports locale-aware formatting for Dutch (nl-NL) and English (en-NL)
 */

// Cache formatters by locale for performance
const euroFormatters = {
  'nl-NL': new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }),
  'en-NL': new Intl.NumberFormat('en-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }),
}

const percentFormatters = {
  'nl-NL': new Intl.NumberFormat('nl-NL', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  'en-NL': new Intl.NumberFormat('en-NL', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
}

// Default locale for backward compatibility
const DEFAULT_LOCALE = 'nl-NL'

/**
 * Format a number as EUR currency
 * @param {number} value - The value to format
 * @param {string} locale - The locale to use ('nl-NL' or 'en-NL')
 * @returns {string} Formatted currency string
 */
export function formatEuro(value, locale = DEFAULT_LOCALE) {
  const formatter = euroFormatters[locale] || euroFormatters[DEFAULT_LOCALE]
  return formatter.format(value)
}

/**
 * Format a number as percentage
 * @param {number} value - The value to format (0.1 = 10%)
 * @param {string} locale - The locale to use ('nl-NL' or 'en-NL')
 * @returns {string} Formatted percentage string
 */
export function formatPercent(value, locale = DEFAULT_LOCALE) {
  const formatter = percentFormatters[locale] || percentFormatters[DEFAULT_LOCALE]
  return formatter.format(value)
}

// Legacy exports for backward compatibility (uses nl-NL)
export const euroFormatter = euroFormatters[DEFAULT_LOCALE]
export const percentFormatter = percentFormatters[DEFAULT_LOCALE]
