import PropTypes from 'prop-types'

/**
 * Shared PropTypes definitions for reuse across components
 */

export const monetaryEntryPropType = PropTypes.shape({
  name: PropTypes.string,
  amount: PropTypes.number.isRequired,
})

export const breakdownEntryPropType = PropTypes.shape({
  description: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
})

export const box3ConfigPropType = PropTypes.shape({
  year: PropTypes.number,
  thresholds: PropTypes.shape({
    taxFreeAssetsPerIndividual: PropTypes.number,
    debtsThresholdPerIndividual: PropTypes.number,
  }),
  taxRate: PropTypes.number,
  assumedReturnRates: PropTypes.shape({
    bankBalance: PropTypes.number,
    investmentAssets: PropTypes.number,
    debts: PropTypes.number,
  }),
})

export const box3InputsPropType = PropTypes.shape({
  bankBalance: PropTypes.number.isRequired,
  investmentAssets: PropTypes.number.isRequired,
  debts: PropTypes.number.isRequired,
  hasTaxPartner: PropTypes.bool.isRequired,
})

export const box3SummaryPropType = PropTypes.shape({
  taxableBase: PropTypes.number.isRequired,
  estimatedTax: PropTypes.number.isRequired,
  breakdown: PropTypes.arrayOf(breakdownEntryPropType).isRequired,
})

export const box1InputsPropType = PropTypes.shape({
  grossIncome: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  period: PropTypes.string,
  hoursPerWeek: PropTypes.number,
  holidayAllowanceIncluded: PropTypes.bool,
  older: PropTypes.bool,
  ruling30Enabled: PropTypes.bool,
  ruling30Category: PropTypes.string,
  socialSecurity: PropTypes.bool,
})

export const box1SummaryPropType = PropTypes.shape({
  taxableBase: PropTypes.number,
  estimatedTax: PropTypes.number,
  netIncome: PropTypes.number,
  breakdown: PropTypes.arrayOf(breakdownEntryPropType),
  details: PropTypes.object,
})
