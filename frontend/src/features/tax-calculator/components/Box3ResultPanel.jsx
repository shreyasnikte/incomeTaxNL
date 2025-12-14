import { useState, useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { box3InputsPropType, box3SummaryPropType, box3ConfigPropType } from '../../../utils/propTypes.js'
import { formatEuro } from '../../../utils/formatters.js'
import './Box3ResultPanel.css'

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

function Box3ResultPanel({ inputs, summary, config }) {
  const { t } = useTranslation()
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false)

  const breakdownLookup = useMemo(() => {
    return summary.breakdown.reduce((acc, item) => {
      if (item?.description) {
        acc[item.description] = item.amount ?? 0
      }
      return acc
    }, {})
  }, [summary.breakdown])

  // Memoize derived calculations
  const derivedValues = useMemo(() => {
    const totalAssets = inputs.bankBalance + inputs.investmentAssets
    const netWorth = totalAssets - inputs.debts
    const taxFreeAllowanceApplied = summary.totalTaxFreeAllowance ?? 0
    const debtsThresholdApplied = summary.totalDebtsThreshold ?? 0

    // Extract values from breakdown for display via lookup map
    const incomeFromSavingsAndInvestments = breakdownLookup['Step 5: Income from savings & investments = taxable returns x share = '] ?? 0
    const taxableReturns = breakdownLookup['Step 1: Total assets = bank savings + investments = '] ?? 0
    const capitalYieldTaxBase = breakdownLookup['Step 2: Capital yield tax base = total assets - deductible debts = '] ?? 0
    
    // Calculate share in capital yield tax base
    const shareInCapitalYieldTaxBase = breakdownLookup['Step 4: Share in capital yield tax base = basis / capital yield tax base = '] ?? 0

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
  }, [inputs, summary, config, breakdownLookup])

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
  
  const partnerLabel = inputs.hasTaxPartner 
    ? t('box3.results.partner.combined') 
    : t('box3.results.partner.individual')

  const primaryHighlight = {
    label: t('box3.results.highlight.estimated_tax.label'),
    value: summary.estimatedTax,
    sublabel: t('box3.results.highlight.estimated_tax.sublabel'),
    info: t('box3.results.highlight.estimated_tax.info'),
  }

  const supportingHighlights = [
    {
      label: t('box3.results.highlight.net_assets.label'),
      value: netWorth,
      sublabel: t('box3.results.highlight.net_assets.sublabel'),
      info: t('box3.results.highlight.net_assets.info'),
    },
    {
      label: t('box3.results.highlight.taxable_base.label'),
      value: summary.taxableBase,
      sublabel: t('box3.results.highlight.taxable_base.sublabel'),
      info: t('box3.results.highlight.taxable_base.info'),
    },
  ]

  const detailedRows = [
    {
      label: t('box3.results.row.total_assets.label'),
      value: totalAssets,
      tone: 'secondary',
      info: t('box3.results.row.total_assets.info'),
    },
    {
      label: t('box3.results.row.debts.label'),
      value: inputs.debts,
      tone: 'secondary',
      info: t('box3.results.row.debts.info'),
    },
    {
      label: t('box3.results.row.allowance.label'),
      value: taxFreeAllowanceApplied,
      tone: 'secondary',
      info: t('box3.results.row.allowance.info'),
    },
  ]

  return (
    <div className="tax-result">
      <header className="tax-result__header">
        <div className="tax-result__title-row">
          <h2>{t('box1.results.title')}</h2>
        </div>
        <div className="tax-result__meta">
          <span className="tax-result__badge">{t('box1.results.tax_year', { year: config?.year ?? 2025 })}</span>
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
            <h3>{t('box1.results.breakdown.title')}</h3>
            <button
              type="button"
              className="tax-result__toggle"
              onClick={() => setIsBreakdownOpen((prev) => !prev)}
              aria-expanded={isBreakdownOpen}
              aria-controls="tax-result-breakdown-content"
            >
              {isBreakdownOpen ? t('box1.results.breakdown.hide') : t('box1.results.breakdown.show')}
            </button>
          </div>

          {isBreakdownOpen && (
            <div id="tax-result-breakdown-content">
                <p className="tax-result__explain-text">{t('box3.results.breakdown.intro')}</p>
                <ol className="tax-result__explain-list">
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>{t('box3.results.breakdown.step1.label')}</strong> = bank savings + investments = {formatEuro(inputs.bankBalance)} + {formatEuro(inputs.investmentAssets)} = <strong>{formatEuro(totalAssets)}</strong>
                    </span>
                    <div className="tax-result__explain-simple">{t('box3.results.breakdown.step1.desc')}</div>
                  </li>
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>{t('box3.results.breakdown.step2.label')}</strong> = total assets − deductible debts = {formatEuro(totalAssets)} − {formatEuro(totalAssets - capitalYieldTaxBase)} = <strong>{formatEuro(capitalYieldTaxBase)}</strong>
                    </span>
                    <div className="tax-result__explain-simple">{t('box3.results.breakdown.step2.desc')}</div>
                  </li>
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>{t('box3.results.breakdown.step3.label')}</strong> = capital yield tax base − allowance = {formatEuro(capitalYieldTaxBase)} − {formatEuro(taxFreeAllowanceApplied)} = <strong>{formatEuro(summary.taxableBase)}</strong>
                    </span>
                    <div className="tax-result__explain-simple">{t('box3.results.breakdown.step3.desc')}</div>
                  </li>
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>{t('box3.results.breakdown.step4.label')}</strong> = basis / capital yield tax base = {formatEuro(summary.taxableBase)} / {formatEuro(capitalYieldTaxBase)} = <strong>{(shareInCapitalYieldTaxBase * 100).toFixed(2)}%</strong>
                    </span>
                    <div className="tax-result__explain-simple">{t('box3.results.breakdown.step4.desc')}</div>
                  </li>
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>{t('box3.results.breakdown.step5.label')}</strong> = taxable returns × share = {formatEuro(taxableReturns)} × {(shareInCapitalYieldTaxBase * 100).toFixed(2)}% = <strong>{formatEuro(incomeFromSavingsAndInvestments)}</strong>
                    </span>
                    <div className="tax-result__explain-simple">{t('box3.results.breakdown.step5.desc')}</div>
                  </li>
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>{t('box3.results.breakdown.step6.label')}</strong> = income × Box 3 tax rate = {formatEuro(incomeFromSavingsAndInvestments)} × <strong>{(actualTaxRate * 100).toFixed(0)}%</strong> = <strong>{formatEuro(summary.estimatedTax)}</strong>
                    </span>
                    <div className="tax-result__explain-simple">{t('box3.results.breakdown.step6.desc')}</div>
                  </li>
                </ol>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

Box3ResultPanel.propTypes = {
  inputs: box3InputsPropType.isRequired,
  summary: box3SummaryPropType.isRequired,
  config: box3ConfigPropType,
}

export default Box3ResultPanel