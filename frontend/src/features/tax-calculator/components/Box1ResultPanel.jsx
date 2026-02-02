import { useState, useMemo, memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { box1InputsPropType, box1SummaryPropType } from '../../../utils/propTypes.js'
import { formatEuro } from '../../../utils/formatters.js'
import { useLanguage } from '../../../context/LanguageContext.jsx'
import './Box1ResultPanel.css'

const InfoIcon = memo(function InfoIcon({ text }) {
  return (
    <span className="box1-result__info" data-tooltip={text} role="img" aria-label={text} tabIndex={0}>
      i
    </span>
  )
})

InfoIcon.propTypes = {
  text: PropTypes.string.isRequired,
}

function Box1ResultPanel({ inputs, summary, year }) {
  const { t, locale } = useLanguage()
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false)
  const [viewPeriod, setViewPeriod] = useState('monthly')

  const PERIOD_OPTIONS = useMemo(() => [
    { key: 'weekly', label: t('box1Result.weekly'), divisor: 52 },
    { key: 'monthly', label: t('box1Result.monthly'), divisor: 12 },
    { key: 'yearly', label: t('box1Result.yearly'), divisor: 1 },
  ], [t])

  const COMPONENT_CATEGORIES = useMemo(() => ({
    income: { label: t('box1Result.income'), default: true },
    taxes: { label: t('box1Result.taxes'), default: true },
    credits: { label: t('box1Result.taxCredits'), default: true },
    deductions: { label: t('box1Result.deductions'), default: true },
  }), [t])

  const [visibleCategories, setVisibleCategories] = useState(() => ({
    income: true,
    taxes: true,
    credits: true,
    deductions: true,
  }))

  const toggleCategory = useCallback((category) => {
    setVisibleCategories(prev => ({ ...prev, [category]: !prev[category] }))
  }, [])

  const derivedValues = useMemo(() => {
    const details = summary.details ?? {}
    const grossYear = details.grossYear ?? 0
    const totalTax = Math.abs(details.incomeTax ?? 0)
    const effectiveTaxRate = grossYear > 0 
      ? (totalTax / grossYear) * 100 
      : 0

    return {
      grossIncome: grossYear,
      taxableIncome: details.taxableYear ?? 0,
      taxFree: details.taxFree ?? 0,
      payrollTax: details.payrollTax ?? 0,
      socialTax: details.socialTax ?? 0,
      generalCredit: details.generalCredit ?? 0,
      labourCredit: details.labourCredit ?? 0,
      incomeTax: details.incomeTax ?? 0,
      netIncome: details.netYear ?? 0,
      netMonth: details.netMonth ?? 0,
      effectiveTaxRate,
    }
  }, [summary])

  const {
    grossIncome,
    taxableIncome,
    taxFree,
    payrollTax,
    socialTax,
    generalCredit,
    labourCredit,
    incomeTax,
    netIncome,
    effectiveTaxRate,
  } = derivedValues

  const periodDivisor = useMemo(() => 
    PERIOD_OPTIONS.find(p => p.key === viewPeriod)?.divisor ?? 1
  , [viewPeriod, PERIOD_OPTIONS])

  const periodLabel = useMemo(() => {
    const labels = { 
      weekly: t('box1Result.perWeek'), 
      monthly: t('box1Result.perMonth'), 
      yearly: t('box1Result.perYear') 
    }
    return labels[viewPeriod] ?? t('box1Result.perYear')
  }, [viewPeriod, t])

  const formatForPeriod = useCallback((value) => 
    formatEuro(value / periodDivisor, locale)
  , [periodDivisor, locale])

  const allowanceLabel = inputs.ruling30Enabled ? t('box1Result.with30Ruling') : t('box1Result.without30Ruling')
  const socialSecurityLabel = inputs.socialSecurity ? t('box1Result.inclSocialSecurity') : t('box1Result.exclSocialSecurity')

  const primaryMetrics = [
    {
      key: 'gross',
      label: t('box1Result.grossIncome'),
      value: grossIncome,
      sublabel: periodLabel,
      tone: 'neutral',
      info: t('box1Result.grossIncomeInfo'),
    },
    {
      key: 'net',
      label: t('box1Result.netIncome'),
      value: netIncome,
      sublabel: periodLabel,
      tone: 'positive',
      info: t('box1Result.netIncomeInfo'),
    },
    {
      key: 'tax',
      label: t('box1Result.totalTax'),
      value: Math.abs(incomeTax),
      sublabel: `${periodLabel} · ${effectiveTaxRate.toFixed(1)}% ${t('box1Result.effectiveRate')}`,
      tone: 'negative',
      info: t('box1Result.totalTaxInfo'),
    },
  ]

  const filteredTableRows = useMemo(() => {
    const detailedTableRows = [
      {
        label: t('box1Result.grossIncome'),
        value: grossIncome,
        category: 'income',
        tone: 'neutral',
        info: t('box1Result.grossIncomeInfo'),
      },
      {
        label: t('box1Result.ruling30TaxFree'),
        value: taxFree,
        category: 'deductions',
        tone: 'positive',
        info: t('box1Result.ruling30TaxFreeInfo'),
      },
      {
        label: t('box1Result.taxableIncome'),
        value: taxableIncome,
        category: 'income',
        tone: 'neutral',
        info: t('box1Result.taxableIncomeInfo'),
      },
      {
        label: t('box1Result.payrollTax'),
        value: payrollTax,
        category: 'taxes',
        tone: 'negative',
        info: t('box1Result.payrollTaxInfo'),
      },
      {
        label: t('box1Result.socialSecurityLabel'),
        value: socialTax,
        category: 'taxes',
        tone: 'negative',
        info: t('box1Result.socialSecurityInfo'),
      },
      {
        label: t('box1Result.generalTaxCredit'),
        value: generalCredit,
        category: 'credits',
        tone: 'positive',
        info: t('box1Result.generalTaxCreditInfo'),
      },
      {
        label: t('box1Result.labourTaxCredit'),
        value: labourCredit,
        category: 'credits',
        tone: 'positive',
        info: t('box1Result.labourTaxCreditInfo'),
      },
      {
        label: t('box1Result.netIncome'),
        value: netIncome,
        category: 'income',
        tone: 'positive',
        info: t('box1Result.netIncomeInfo'),
      },
    ]
    return detailedTableRows.filter(row => visibleCategories[row.category])
  }, [visibleCategories, grossIncome, taxableIncome, taxFree, payrollTax, socialTax, generalCredit, labourCredit, netIncome, t])

  return (
    <div className="box1-result">
      <header className="box1-result__header">
        <div className="box1-result__title-row">
          <h2>{t('box1Result.results')}</h2>
        </div>
        <div className="box1-result__meta">
          <span className="box1-result__badge">{t('box1Result.taxYear')} {year}</span>
          <span className="box1-result__badge box1-result__badge--neutral">{allowanceLabel}</span>
          <span className="box1-result__badge box1-result__badge--neutral">{socialSecurityLabel}</span>
        </div>
      </header>

      {/* Period Toggle */}
      <div className="box1-result__period-toggle" role="tablist" aria-label={t('box1Form.period')}>
        {PERIOD_OPTIONS.map(option => (
          <button
            key={option.key}
            type="button"
            role="tab"
            aria-selected={viewPeriod === option.key}
            className={`box1-result__period-btn${viewPeriod === option.key ? ' box1-result__period-btn--active' : ''}`}
            onClick={() => setViewPeriod(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Primary Metrics Row */}
      <section className="box1-result__primary-row" aria-label="Key figures">
        {primaryMetrics.map(metric => (
          <article 
            key={metric.key}
            className={`box1-result__metric box1-result__metric--${metric.tone}`}
            aria-live="polite"
          >
            <div className="box1-result__metric-header">
              <span className="box1-result__metric-label">{metric.label}</span>
              <InfoIcon text={metric.info} />
            </div>
            <span className="box1-result__metric-value">{formatForPeriod(metric.value)}</span>
            {metric.sublabel && (
              <span className="box1-result__metric-sub">{metric.sublabel}</span>
            )}
          </article>
        ))}
      </section>

      {/* Calculation Breakdown Section */}
      <section className="box1-result__breakdown" aria-label={t('box1Result.calculationBreakdown')}>
        <div className="box1-result__breakdown-header">
          <h3>{t('box1Result.calculationBreakdown')}</h3>
          <button
            type="button"
            className="box1-result__toggle"
            onClick={() => setIsBreakdownOpen((prev) => !prev)}
            aria-expanded={isBreakdownOpen}
            aria-controls="box1-result-breakdown-content"
          >
            {isBreakdownOpen ? t('box1Result.hideBreakdown') : t('box1Result.showBreakdown')}
          </button>
        </div>

        <div 
          id="box1-result-breakdown-content" 
          className={`box1-result__breakdown-content${isBreakdownOpen ? ' box1-result__breakdown-content--open' : ''}`}
        >
          <div className="box1-result__breakdown-inner">
            <div className="box1-result__filter-group" role="group" aria-label="Filter components">
              {Object.entries(COMPONENT_CATEGORIES).map(([key, { label }]) => (
                <label key={key} className="box1-result__filter-chip">
                  <input
                    type="checkbox"
                    checked={visibleCategories[key]}
                    onChange={() => toggleCategory(key)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <div className="box1-result__table-wrapper">
              <table className="box1-result__table">
                <thead>
                  <tr>
                    <th>{t('box1Result.component')}</th>
                    <th>{PERIOD_OPTIONS.find(p => p.key === viewPeriod)?.label ?? t('box3Form.amount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTableRows.map(row => (
                    <tr key={row.label} className={`box1-result__table-row--${row.tone}`}>
                      <td>
                        <div className="box1-result__table-label">
                          <span>{row.label}</span>
                          <InfoIcon text={row.info} />
                        </div>
                      </td>
                      <td>{formatForPeriod(row.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

Box1ResultPanel.propTypes = {
  inputs: box1InputsPropType.isRequired,
  summary: box1SummaryPropType.isRequired,
  year: PropTypes.number.isRequired,
}

export default Box1ResultPanel
