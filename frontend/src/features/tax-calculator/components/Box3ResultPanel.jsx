import { useState, useMemo, memo } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import PropTypes from 'prop-types'
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

  const partnerLabel = inputs.hasTaxPartner ? t('box3.result.badges.partner') : t('box3.result.badges.individual')

  const primaryHighlight = {
    label: t('box3.result.highlights.tax.label'),
    value: summary.estimatedTax,
    sublabel: t('box3.result.highlights.tax.sublabel'),
    info: t('box3.result.highlights.tax.info'),
  }

  const supportingHighlights = [
    {
      label: t('box3.result.highlights.netWorth.label'),
      value: netWorth,
      sublabel: t('box3.result.highlights.netWorth.sublabel'),
      info: t('box3.result.highlights.netWorth.info'),
    },
    {
      label: t('box3.result.highlights.taxableBase.label'),
      value: summary.taxableBase,
      sublabel: t('box3.result.highlights.taxableBase.sublabel'),
      info: t('box3.result.highlights.taxableBase.info'),
    },
  ]

  const detailedRows = [
    {
      label: t('box3.result.rows.assets.label'),
      value: totalAssets,
      tone: 'secondary',
      info: t('box3.result.rows.assets.info'),
    },
    {
      label: t('box3.result.rows.debts.label'),
      value: inputs.debts,
      tone: 'secondary',
      info: t('box3.result.rows.debts.info'),
    },
    {
      label: t('box3.result.rows.allowance.label'),
      value: taxFreeAllowanceApplied,
      tone: 'secondary',
      info: t('box3.result.rows.allowance.info'),
    },
  ]

  return (
    <div className="tax-result">
      <header className="tax-result__header">
        <div className="tax-result__title-row">
          <h2>{t('box3.result.title')}</h2>
        </div>
        <div className="tax-result__meta">
          <span className="tax-result__badge">{t('box3.result.badges.year', { year: config?.year ?? 2025 })}</span>
          <span className="tax-result__badge tax-result__badge--neutral">{partnerLabel}</span>
        </div>
      </header>

      <section className="tax-result__highlights" aria-label={t('box3.result.title')}>
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
        <section className="tax-result__breakdown" aria-label={t('box3.result.breakdown.title')}>
          <div className="tax-result__breakdown-header">
            <h3>{t('box3.result.breakdown.title')}</h3>
            <button
              type="button"
              className="tax-result__toggle"
              onClick={() => setIsBreakdownOpen((prev) => !prev)}
              aria-expanded={isBreakdownOpen}
              aria-controls="tax-result-breakdown-content"
            >
              {isBreakdownOpen ? t('box3.result.breakdown.hide') : t('box3.result.breakdown.show')}
            </button>
          </div>

          {isBreakdownOpen && (
            <div id="tax-result-breakdown-content">
              <p className="tax-result__explain-text">{t('box3.result.breakdown.intro')}</p>
              <ol className="tax-result__explain-list">
                <li style={{ marginBottom: '1.5em' }}>
                  <span className="tax-result__math">
                    <Trans
                      i18nKey="box3.result.breakdown.steps.1.math"
                      values={{
                        bank: formatEuro(inputs.bankBalance),
                        investments: formatEuro(inputs.investmentAssets),
                        total: formatEuro(totalAssets)
                      }}
                    />
                  </span>
                  <div className="tax-result__explain-simple">{t('box3.result.breakdown.steps.1.explain')}</div>
                </li>
                <li style={{ marginBottom: '1.5em' }}>
                  <span className="tax-result__math">
                    <Trans
                      i18nKey="box3.result.breakdown.steps.2.math"
                      values={{
                        assets: formatEuro(totalAssets),
                        debts: formatEuro(totalAssets - capitalYieldTaxBase),
                        base: formatEuro(capitalYieldTaxBase)
                      }}
                    />
                  </span>
                  <div className="tax-result__explain-simple">{t('box3.result.breakdown.steps.2.explain')}</div>
                </li>
                <li style={{ marginBottom: '1.5em' }}>
                  <span className="tax-result__math">
                    <Trans
                      i18nKey="box3.result.breakdown.steps.3.math"
                      values={{
                        base: formatEuro(capitalYieldTaxBase),
                        allowance: formatEuro(taxFreeAllowanceApplied),
                        taxable: formatEuro(summary.taxableBase)
                      }}
                    />
                  </span>
                  <div className="tax-result__explain-simple">{t('box3.result.breakdown.steps.3.explain')}</div>
                </li>
                <li style={{ marginBottom: '1.5em' }}>
                  <span className="tax-result__math">
                    <Trans
                      i18nKey="box3.result.breakdown.steps.4.math"
                      values={{
                        basis: formatEuro(summary.taxableBase),
                        base: formatEuro(capitalYieldTaxBase),
                        share: (shareInCapitalYieldTaxBase * 100).toFixed(2)
                      }}
                    />
                  </span>
                  <div className="tax-result__explain-simple">{t('box3.result.breakdown.steps.4.explain')}</div>
                </li>
                <li style={{ marginBottom: '1.5em' }}>
                  <span className="tax-result__math">
                    <Trans
                      i18nKey="box3.result.breakdown.steps.5.math"
                      values={{
                        returns: formatEuro(taxableReturns),
                        share: (shareInCapitalYieldTaxBase * 100).toFixed(2),
                        income: formatEuro(incomeFromSavingsAndInvestments)
                      }}
                    />
                  </span>
                  <div className="tax-result__explain-simple">{t('box3.result.breakdown.steps.5.explain')}</div>
                </li>
                <li style={{ marginBottom: '1.5em' }}>
                  <span className="tax-result__math">
                    <Trans
                      i18nKey="box3.result.breakdown.steps.6.math"
                      values={{
                        income: formatEuro(incomeFromSavingsAndInvestments),
                        rate: (actualTaxRate * 100).toFixed(0),
                        tax: formatEuro(summary.estimatedTax)
                      }}
                    />
                  </span>
                  <div className="tax-result__explain-simple">{t('box3.result.breakdown.steps.6.explain')}</div>
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
