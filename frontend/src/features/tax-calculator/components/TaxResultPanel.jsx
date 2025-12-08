import { useState } from 'react'
import PropTypes from 'prop-types'
import './TaxResultPanel.css'

const euroFormat = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
})

function InfoIcon({ text }) {
  return (
    <span className="tax-result__info" data-tooltip={text} role="img" aria-label={text} tabIndex={0}>
      i
    </span>
  )
}

InfoIcon.propTypes = {
  text: PropTypes.string.isRequired,
}

function TaxResultPanel({ inputs, summary, config }) {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false)
  const totalAssets = inputs.bankBalance + inputs.investmentAssets
  const netWorth = totalAssets - inputs.debts
  const partnerLabel = inputs.hasTaxPartner ? 'With tax partner' : 'Without tax partner'
  const allowanceMultiplier = inputs.hasTaxPartner ? 2 : 1
  const taxFreeAllowanceApplied =
    (config?.thresholds?.taxFreeAssetsPerIndividual ?? 0) * allowanceMultiplier
  const debtsThresholdApplied =
    (config?.thresholds?.debtsThresholdPerIndividual ?? 0) * allowanceMultiplier
  const derivedBox3Rate = summary.taxableBase > 0 ? summary.estimatedTax / summary.taxableBase : null

  const primaryHighlight = {
    label: 'Estimated tax',
    value: summary.estimatedTax,
    sublabel: 'Based on current Box 3 rates',
    info: 'Projected Box 3 tax for the selected year using current assumptions.',
  }

  const supportingHighlights = [
    {
      label: 'Net assets',
      value: netWorth,
      sublabel: 'Assets minus deductible debts',
      info: 'Your savings and investments after subtracting deductible debts.',
    },
    {
      label: 'Taxable base',
      value: summary.taxableBase,
      sublabel: 'Savings & investments after allowance',
      info: 'Amount that remains after the tax-free allowance has been applied.',
    },
  ]

  const detailedRows = [
    {
      label: 'Total assets',
      value: totalAssets,
      tone: 'secondary',
      info: 'Combined balances of your bank and investment accounts.',
    },
    {
      label: 'Debts',
      value: inputs.debts,
      tone: 'secondary',
      info: 'Deductible debts included in the Box 3 calculation.',
    },
    {
      label: 'Allowances applied',
      value: taxFreeAllowanceApplied,
      tone: 'secondary',
      info: 'Standard tax-free allowance applied to your Box 3 assets.',
    },
  ]

  return (
    <div className="tax-result">
      <header className="tax-result__header">
        <h2>Results</h2>
        <div className="tax-result__meta">
          <span className="tax-result__badge">Tax year {config?.year ?? 2025}</span>
          <span className="tax-result__badge tax-result__badge--neutral">{partnerLabel}</span>
        </div>
      </header>

      <section className="tax-result__highlights" aria-label="Key figures">
        <div className="tax-result__primary">
          <article className="tax-result__highlight tax-result__highlight--accent" aria-live="polite">
            <div className="tax-result__highlight-header">
              <span className="tax-result__highlight-label">{primaryHighlight.label}</span>
              <InfoIcon text={primaryHighlight.info} />
            </div>
            <span className="tax-result__highlight-value">
              {euroFormat.format(primaryHighlight.value)}
            </span>
            <span className="tax-result__highlight-sub">{primaryHighlight.sublabel}</span>
          </article>
        </div>

        <div className="tax-result__supporting">
          {supportingHighlights.map((block, index) => (
            <article className="tax-result__highlight" key={block.label}>
              <div className="tax-result__highlight-header">
                <span className="tax-result__highlight-label">{block.label}</span>
                <InfoIcon text={block.info} />
              </div>
              <span className="tax-result__highlight-value">{euroFormat.format(block.value)}</span>
              <span className="tax-result__highlight-sub">{block.sublabel}</span>
            </article>
          ))}
        </div>
      </section>

      <p className="tax-result__note">
        Numbers update instantly in your browser using the latest Box 3 assumptions.
      </p>

      <dl className="tax-result__list" aria-label="Detailed figures">
        {detailedRows.map((row) => (
          <div
            className={`tax-result__row${row.tone ? ` tax-result__row--${row.tone}` : ''}`}
            key={row.label}
          >
            <div className="tax-result__row-header">
              <dt>{row.label}</dt>
              <InfoIcon text={row.info} />
            </div>
            <dd>{euroFormat.format(row.value)}</dd>
          </div>
        ))}
      </dl>

      {summary.breakdown.length > 0 && (
        <section className="tax-result__breakdown" aria-label="Calculation breakdown">
          <div className="tax-result__breakdown-header">
            <h3>Calculation breakdown</h3>
            <button
              type="button"
              className="tax-result__toggle"
              onClick={() => setIsBreakdownOpen((prev) => !prev)}
              aria-expanded={isBreakdownOpen}
              aria-controls="tax-result-breakdown-content"
            >
              {isBreakdownOpen ? 'Hide breakdown' : 'Show breakdown'}
            </button>
          </div>

          {isBreakdownOpen && (
            <div id="tax-result-breakdown-content">
              <p className="tax-result__explain-text">Here is the math spelled out step by step:</p>
              <ol className="tax-result__explain-list">
                <li>
                  <span className="tax-result__math">
                    Total assets = bank savings + investments = {euroFormat.format(inputs.bankBalance)} +{' '}
                    {euroFormat.format(inputs.investmentAssets)} = <strong>{euroFormat.format(totalAssets)}</strong>
                  </span>
                </li>
                <li>
                  <span className="tax-result__math">
                    Net assets = total assets − debts = {euroFormat.format(totalAssets)} −{' '}
                    {euroFormat.format(inputs.debts)} = <strong>{euroFormat.format(netWorth)}</strong>
                  </span>
                </li>
                <li>
                  <span className="tax-result__math">
                    Taxable base = net assets − allowance = {euroFormat.format(netWorth)} −{' '}
                    {euroFormat.format(taxFreeAllowanceApplied)} = <strong>{euroFormat.format(summary.taxableBase)}</strong>
                  </span>
                </li>
                <li>
                  <span className="tax-result__math">
                    Estimated tax = Box 3 rate × taxable base ≈{' '}
                    {derivedBox3Rate !== null ? `${(derivedBox3Rate * 100).toFixed(2)}%` : 'current rate'} ×{' '}
                    {euroFormat.format(summary.taxableBase)} = <strong>{euroFormat.format(summary.estimatedTax)}</strong>
                  </span>
                </li>
              </ol>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

TaxResultPanel.propTypes = {
  inputs: PropTypes.shape({
    bankBalance: PropTypes.number.isRequired,
    investmentAssets: PropTypes.number.isRequired,
    debts: PropTypes.number.isRequired,
    hasTaxPartner: PropTypes.bool.isRequired,
  }).isRequired,
  summary: PropTypes.shape({
    taxableBase: PropTypes.number.isRequired,
    estimatedTax: PropTypes.number.isRequired,
    breakdown: PropTypes.arrayOf(PropTypes.object).isRequired,
    box3RatePercentage: PropTypes.number,
  }).isRequired,
  config: PropTypes.shape({
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
  }),
}

export default TaxResultPanel
