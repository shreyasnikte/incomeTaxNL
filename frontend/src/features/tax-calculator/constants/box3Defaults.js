// Year-keyed Box 3 tax defaults
export const BOX3_DEFAULTS_BY_YEAR = {
  2024: {
    thresholds: {
      taxFreeAssetsPerIndividual: 57000,
      debtsThresholdPerIndividual: 3400,
    },
    taxRate: 36 / 100,
    assumedReturnRates: {
      bankBalance: 1.03 / 100,
      investmentAssets: 6.04 / 100,
      debts: 2.47 / 100,
    },
  },
  2025: {
    thresholds: {
      taxFreeAssetsPerIndividual: 57000,
      debtsThresholdPerIndividual: 3400,
    },
    taxRate: 32 / 100,
    assumedReturnRates: {
      bankBalance: 0.92 / 100,
      investmentAssets: 6.17 / 100,
      debts: 2.46 / 100,
    },
  },
}

export const AVAILABLE_YEARS = Object.keys(BOX3_DEFAULTS_BY_YEAR)
  .map(Number)
  .sort((a, b) => b - a)

export const DEFAULT_YEAR = 2025

// Helper to get defaults for a specific year
export function getDefaultsForYear(year) {
  return BOX3_DEFAULTS_BY_YEAR[year] ?? BOX3_DEFAULTS_BY_YEAR[DEFAULT_YEAR]
}

// Legacy export for backward compatibility (current year defaults with year field)
export const BOX3_DEFAULTS = {
  year: DEFAULT_YEAR,
  ...BOX3_DEFAULTS_BY_YEAR[DEFAULT_YEAR],
}
