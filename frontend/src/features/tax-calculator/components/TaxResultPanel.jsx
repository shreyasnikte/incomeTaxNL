import { useState, useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { box3InputsPropType, box3SummaryPropType, box3ConfigPropType } from '../../../utils/propTypes.js'
import { formatEuro } from '../../../utils/formatters.js'
import './TaxResultPanel.css'

const InfoIcon = memo(function InfoIcon({ text }) {
  return (
    <span className="tax-result__info" data-tooltip={text} role="img" aria-label={text} tabIndex={0}>
      i
    </span>
  )
})

InfoIcon.propTypes = {
  text: PropTypes.string.isRequired,
}

function TaxResultPanel({ inputs, summary, config }) {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false)

  // Memoize derived calculations
  const derivedValues = useMemo(() => {
    const totalAssets = inputs.bankBalance + inputs.investmentAssets
    const netWorth = totalAssets - inputs.debts
    const allowanceMultiplier = inputs.hasTaxPartner ? 2 : 1
    const taxFreeAllowanceApplied =
      (config?.thresholds?.taxFreeAssetsPerIndividual ?? 0) * allowanceMultiplier
    const debtsThresholdApplied =
      (config?.thresholds?.debtsThresholdPerIndividual ?? 0) * allowanceMultiplier

    // Extract values from breakdown for display
    const incomeFromSavingsAndInvestments = 
      summary.breakdown.find(item => item.description === 'Income from savings and investments')?.amount ?? 0
    const taxableReturns = 
      summary.breakdown.find(item => item.description === 'Taxable returns')?.amount ?? 0
    const capitalYieldTaxBase = 
      summary.breakdown.find(item => item.description === 'Capital yield tax base')?.amount ?? 0
    
    // Calculate share in capital yield tax base
    const shareInCapitalYieldTaxBase = 
      capitalYieldTaxBase > 0 ? summary.taxableBase / capitalYieldTaxBase : 0

    // Get actual tax rate from config
    const actualTaxRate = config?.taxRate ?? 0

    return {
      totalAssets,
      netWorth,
      taxFreeAllowanceApplied,
      debtsThresholdApplied,
      incomeFromSavingsAndInvestments,
      taxableReturns,
      capitalYieldTaxBase,
      shareInCapitalYieldTaxBase,
      actualTaxRate,
    }
  }, [inputs, summary, config])

  const { 
    totalAssets, 
    netWorth, 
    taxFreeAllowanceApplied, 
    incomeFromSavingsAndInvestments,
    taxableReturns,
    capitalYieldTaxBase,
    shareInCapitalYieldTaxBase,
    actualTaxRate,
  } = derivedValues
  const partnerLabel = inputs.hasTaxPartner ? 'With tax partner' : 'Without tax partner'

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
        <div className="tax-result__title-row">
          <h2>Results</h2>
        </div>
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
              {formatEuro(primaryHighlight.value)}
            </span>
            <span className="tax-result__highlight-sub">{primaryHighlight.sublabel}</span>
          </article>
        </div>

        <div className="tax-result__supporting">
          {supportingHighlights.map((block) => (
            <article className="tax-result__highlight" key={block.label}>
              <div className="tax-result__highlight-header">
                <span className="tax-result__highlight-label">{block.label}</span>
                <InfoIcon text={block.info} />
              </div>
              <span className="tax-result__highlight-value">{formatEuro(block.value)}</span>
              <span className="tax-result__highlight-sub">{block.sublabel}</span>
            </article>
          ))}
        </div>
      </section>

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
            <dd>{formatEuro(row.value)}</dd>
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
                <p className="tax-result__explain-text">Here is the math spelled out step by step, with simple explanations:</p>
                <ol className="tax-result__explain-list">
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>Total assets</strong> = bank savings + investments = {formatEuro(inputs.bankBalance)} + {formatEuro(inputs.investmentAssets)} = <strong>{formatEuro(totalAssets)}</strong>
                    </span>
                    <div className="tax-result__explain-simple">This is all the money you have in the bank and in investments, added together.</div>
                  </li>
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>Capital yield tax base</strong> = total assets − deductible debts = {formatEuro(totalAssets)} − {formatEuro(totalAssets - capitalYieldTaxBase)} = <strong>{formatEuro(capitalYieldTaxBase)}</strong>
                    </span>
                    <div className="tax-result__explain-simple">We subtract the debts you can deduct from your total money. This gives the amount the tax office looks at.</div>
                  </li>
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>Basis for savings & investments</strong> = capital yield tax base − allowance = {formatEuro(capitalYieldTaxBase)} − {formatEuro(taxFreeAllowanceApplied)} = <strong>{formatEuro(summary.taxableBase)}</strong>
                    </span>
                    <div className="tax-result__explain-simple">You get a tax-free allowance. We take this away from the amount above. Only the rest is taxed.</div>
                  </li>
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>Share in capital yield tax base</strong> = basis / capital yield tax base = {formatEuro(summary.taxableBase)} / {formatEuro(capitalYieldTaxBase)} = <strong>{(shareInCapitalYieldTaxBase * 100).toFixed(2)}%</strong>
                    </span>
                    <div className="tax-result__explain-simple">This shows what part of your money is taxed after the allowance. If you have little money, this part is small.</div>
                  </li>
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>Income from savings & investments</strong> = taxable returns × share = {formatEuro(taxableReturns)} × {(shareInCapitalYieldTaxBase * 100).toFixed(2)}% = <strong>{formatEuro(incomeFromSavingsAndInvestments)}</strong>
                    </span>
                    <div className="tax-result__explain-simple">This is the amount the tax office thinks you earn from your savings and investments, based on rules.</div>
                  </li>
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>Estimated tax</strong> = income × Box 3 tax rate = {formatEuro(incomeFromSavingsAndInvestments)} × <strong>{(actualTaxRate * 100).toFixed(0)}%</strong> = <strong>{formatEuro(summary.estimatedTax)}</strong>
                    </span>
                    <div className="tax-result__explain-simple">This is the final tax you pay. It is a percentage of the amount above.</div>
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
  inputs: box3InputsPropType.isRequired,
  summary: box3SummaryPropType.isRequired,
  config: box3ConfigPropType,
}

export default TaxResultPanel
