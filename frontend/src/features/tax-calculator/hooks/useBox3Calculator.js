import { useMemo } from 'react'
import { BOX3_DEFAULTS, getDefaultsForYear, calculateBox3Tax } from 'dutch-tax-box3-calculator'

/**
 * Custom hook for calculating Box 3 tax summary
 * Memoized to prevent unnecessary recalculations
 *
 * @param {Object} inputs - The tax calculation inputs
 * @param {number} inputs.bankBalance - Total bank balance
 * @param {number} inputs.investmentAssets - Total investment assets
 * @param {number} inputs.debts - Total debts
 * @param {boolean} inputs.hasTaxPartner - Whether user has a tax partner
 * @param {Object} config - Box 3 configuration (defaults to current year)
 * @returns {Object} Tax summary with taxableBase, estimatedTax, and breakdown
 */
export function useBox3Calculator(inputs, config = BOX3_DEFAULTS) {
  // Destructure to create stable dependency array
  const { bankBalance = 0, investmentAssets = 0, debts = 0, hasTaxPartner = false } = inputs ?? {}
  const configYear = config?.year

  return useMemo(() => {
    // If config has a year, merge with year-specific defaults as base
    const yearDefaults = configYear ? getDefaultsForYear(configYear) : {}
    const mergedConfig = { ...yearDefaults, ...config }
    return calculateBox3Tax(
      { bankBalance, investmentAssets, debts, hasTaxPartner },
      mergedConfig,
    )
  }, [bankBalance, investmentAssets, debts, hasTaxPartner, configYear, config])
}
