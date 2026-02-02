import { useState, useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { DEFAULT_YEAR } from 'dutch-tax-box3-calculator'
import { box3InputsPropType, box3SummaryPropType, box3ConfigPropType } from '../../../utils/propTypes.js'
import { formatEuro } from '../../../utils/formatters.js'
import { useLanguage } from '../../../context/LanguageContext.jsx'
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
  const { t, locale } = useLanguage()
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
  const partnerLabel = inputs.hasTaxPartner ? t('box3Result.combinedTax') : t('box3Result.individualTax')

  const primaryHighlight = {
    label: t('box3Result.estimatedTax'),
    value: summary.estimatedTax,
    sublabel: t('box3Result.basedOnRates'),
    info: t('box3Result.estimatedTaxInfo'),
  }

  const supportingHighlights = [
    {
      label: t('box3Result.netAssets'),
      value: netWorth,
      sublabel: t('box3Result.assetsMinusDebts'),
      info: t('box3Result.netAssetsInfo'),
    },
    {
      label: t('box3Result.taxableBase'),
      value: summary.taxableBase,
      sublabel: t('box3Result.savingsAfterAllowance'),
      info: t('box3Result.taxableBaseInfo'),
    },
  ]

  const detailedRows = [
    {
      label: t('box3Result.totalAssets'),
      value: totalAssets,
      tone: 'secondary',
      info: t('box3Result.totalAssetsInfo'),
    },
    {
      label: t('box3Result.debts'),
      value: inputs.debts,
      tone: 'secondary',
      info: t('box3Result.debtsInfo'),
    },
    {
      label: t('box3Result.allowancesApplied'),
      value: taxFreeAllowanceApplied,
      tone: 'secondary',
      info: t('box3Result.allowancesAppliedInfo'),
    },
  ]

  return (
    <div className="tax-result">
      <header className="tax-result__header">
        <div className="tax-result__title-row">
          <h2>{t('box3Result.results')}</h2>
        </div>
        <div className="tax-result__meta">
          <span className="tax-result__badge">{t('box3Result.taxYear')} {config?.year ?? DEFAULT_YEAR}</span>
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
              {formatEuro(primaryHighlight.value, locale)}
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
              <span className="tax-result__highlight-value">{formatEuro(block.value, locale)}</span>
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
            <dd>{formatEuro(row.value, locale)}</dd>
          </div>
        ))}
      </dl>

      <aside className="tax-result__disclaimer">
        <p>
          {t('box3Result.actualReturnDisclaimer')}{' '}
          <a
            href="https://www.belastingdienst.nl/wps/wcm/connect/en/income-in-box-3/content/which-details-submit-actual-return"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('box3Result.learnMore')} ↗
          </a>
        </p>
      </aside>

      {summary.breakdown.length > 0 && (
        <section className="tax-result__breakdown" aria-label={t('box3Result.calculationBreakdown')}>
          <div className="tax-result__breakdown-header">
            <h3>{t('box3Result.calculationBreakdown')}</h3>
            <button
              type="button"
              className="tax-result__toggle"
              onClick={() => setIsBreakdownOpen((prev) => !prev)}
              aria-expanded={isBreakdownOpen}
              aria-controls="tax-result-breakdown-content"
            >
              {isBreakdownOpen ? t('box3Result.hideBreakdown') : t('box3Result.showBreakdown')}
            </button>
          </div>

          {isBreakdownOpen && (
            <div id="tax-result-breakdown-content">
                <p className="tax-result__explain-text">Here is the math spelled out step by step, with simple explanations:</p>
                <ol className="tax-result__explain-list">
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>Total assets</strong> = bank savings + investments = {formatEuro(inputs.bankBalance, locale)} + {formatEuro(inputs.investmentAssets, locale)} = <strong>{formatEuro(totalAssets, locale)}</strong>
                    </span>
                    <div className="tax-result__explain-simple">This is all the money you have in the bank and in investments, added together.</div>
                  </li>
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>Capital yield tax base</strong> = total assets − deductible debts = {formatEuro(totalAssets, locale)} − {formatEuro(totalAssets - capitalYieldTaxBase, locale)} = <strong>{formatEuro(capitalYieldTaxBase, locale)}</strong>
                    </span>
                    <div className="tax-result__explain-simple">We subtract the debts you can deduct from your total money. This gives the amount the tax office looks at.</div>
                  </li>
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>Basis for savings & investments</strong> = capital yield tax base − allowance = {formatEuro(capitalYieldTaxBase, locale)} − {formatEuro(taxFreeAllowanceApplied, locale)} = <strong>{formatEuro(summary.taxableBase, locale)}</strong>
                    </span>
                    <div className="tax-result__explain-simple">You get a tax-free allowance. We take this away from the amount above. Only the rest is taxed.</div>
                  </li>
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>Share in capital yield tax base</strong> = basis / capital yield tax base = {formatEuro(summary.taxableBase, locale)} / {formatEuro(capitalYieldTaxBase, locale)} = <strong>{(shareInCapitalYieldTaxBase * 100).toFixed(2)}%</strong>
                    </span>
                    <div className="tax-result__explain-simple">This shows what part of your money is taxed after the allowance. If you have little money, this part is small.</div>
                  </li>
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>Income from savings & investments</strong> = taxable returns × share = {formatEuro(taxableReturns, locale)} × {(shareInCapitalYieldTaxBase * 100).toFixed(2)}% = <strong>{formatEuro(incomeFromSavingsAndInvestments, locale)}</strong>
                    </span>
                    <div className="tax-result__explain-simple">This is the amount the tax office thinks you earn from your savings and investments, based on rules.</div>
                  </li>
                  <li style={{ marginBottom: '1.5em' }}>
                    <span className="tax-result__math">
                      <strong>Estimated tax</strong> = income × Box 3 tax rate = {formatEuro(incomeFromSavingsAndInvestments, locale)} × <strong>{(actualTaxRate * 100).toFixed(0)}%</strong> = <strong>{formatEuro(summary.estimatedTax, locale)}</strong>
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

Box3ResultPanel.propTypes = {
  inputs: box3InputsPropType.isRequired,
  summary: box3SummaryPropType.isRequired,
  config: box3ConfigPropType,
}

export default Box3ResultPanel
