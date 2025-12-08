/**
 * Centralized formatting utilities
 * Instantiated once at module level for performance
 */

export const euroFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
})

export const percentFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Format a number as EUR currency
 * @param {number} value - The value to format
 * @returns {string} Formatted currency string
 */
export function formatEuro(value) {
  return euroFormatter.format(value)
}

/**
 * Format a number as percentage
 * @param {number} value - The value to format (0.1 = 10%)
 * @returns {string} Formatted percentage string
 */
export function formatPercent(value) {
  return percentFormatter.format(value)
}
