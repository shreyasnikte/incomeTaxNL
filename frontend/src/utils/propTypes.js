import PropTypes from 'prop-types'

/**
 * Shared PropTypes definitions for reuse across components
 */

export const monetaryEntryPropType = PropTypes.shape({
  name: PropTypes.string,
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

export const taxInputsPropType = PropTypes.shape({
  bankBalance: PropTypes.number.isRequired,
  investmentAssets: PropTypes.number.isRequired,
  debts: PropTypes.number.isRequired,
  hasTaxPartner: PropTypes.bool.isRequired,
})

export const taxSummaryPropType = PropTypes.shape({
  taxableBase: PropTypes.number.isRequired,
  estimatedTax: PropTypes.number.isRequired,
  breakdown: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
})
