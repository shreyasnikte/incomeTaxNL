import { useState, useMemo, memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { box1InputsPropType, box1SummaryPropType } from '../../../utils/propTypes.js'
import { formatEuro } from '../../../utils/formatters.js'
import './Box1ResultPanel.css'

const CATEGORY_DEFAULTS = {
  income: true,
  taxes: true,
  credits: true,
  deductions: true,
}

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
  const { t } = useTranslation()
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false)
  const [viewPeriod, setViewPeriod] = useState('monthly')
  const [visibleCategories, setVisibleCategories] = useState(CATEGORY_DEFAULTS)

  const periodOptions = useMemo(() => [
    { key: 'weekly', label: t('box1.results.period_label.weekly'), divisor: 52 },
    { key: 'monthly', label: t('box1.results.period_label.monthly'), divisor: 12 },
    { key: 'yearly', label: t('box1.results.period_label.yearly'), divisor: 1 },
  ], [t])

  const categoryLabels = useMemo(() => ({
    income: t('box1.results.category.income'),
    taxes: t('box1.results.category.taxes'),
    credits: t('box1.results.category.credits'),
    deductions: t('box1.results.category.deductions'),
  }), [t])

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
    periodOptions.find(p => p.key === viewPeriod)?.divisor ?? 1
  , [viewPeriod, periodOptions])

  const periodLabel = useMemo(() => {
    return periodOptions.find(p => p.key === viewPeriod)?.label ?? t('box1.results.period_label.yearly')
  }, [viewPeriod, periodOptions, t])

  const formatForPeriod = useCallback((value) => 
    formatEuro(value / periodDivisor)
  , [periodDivisor])

  const allowanceLabel = inputs.ruling30Enabled 
    ? t('box1.results.badge.ruling_on') 
    : t('box1.results.badge.ruling_off')
  const socialSecurityLabel = inputs.socialSecurity 
    ? t('box1.results.badge.social_on') 
    : t('box1.results.badge.social_off')

  const primaryMetrics = [
    {
      key: 'gross',
      label: t('box1.metric.gross_income.label'),
      value: grossIncome,
      sublabel: periodLabel,
      tone: 'neutral',
      info: t('box1.metric.gross_income.info'),
    },
    {
      key: 'net',
      label: t('box1.metric.net_income.label'),
      value: netIncome,
      sublabel: periodLabel,
      tone: 'positive',
      info: t('box1.metric.net_income.info'),
    },
    {
      key: 'tax',
      label: t('box1.metric.total_tax.label'),
      value: Math.abs(incomeTax),
      sublabel: `${periodLabel} · ${t('box1.results.effective_rate', { rate: effectiveTaxRate.toFixed(1) })}`,
      tone: 'negative',
      info: t('box1.metric.total_tax.info'),
    },
  ]

  const filteredTableRows = useMemo(() => {
    const detailedTableRows = [
      {
        label: t('box1.metric.gross_income.label'),
        value: grossIncome,
        category: 'income',
        tone: 'neutral',
        info: t('box1.metric.gross_income.info'),
      },
      {
        label: t('box1.metric.ruling_free.label'),
        value: taxFree,
        category: 'deductions',
        tone: 'positive',
        info: t('box1.metric.ruling_free.info'),
      },
      {
        label: t('box1.metric.taxable_income.label'),
        value: taxableIncome,
        category: 'income',
        tone: 'neutral',
        info: t('box1.metric.taxable_income.info'),
      },
      {
        label: t('box1.metric.payroll_tax.label'),
        value: payrollTax,
        category: 'taxes',
        tone: 'negative',
        info: t('box1.metric.payroll_tax.info'),
      },
      {
        label: t('box1.metric.social_security.label'),
        value: socialTax,
        category: 'taxes',
        tone: 'negative',
        info: t('box1.metric.social_security.info'),
      },
      {
        label: t('box1.metric.general_credit.label'),
        value: generalCredit,
        category: 'credits',
        tone: 'positive',
        info: t('box1.metric.general_credit.info'),
      },
      {
        label: t('box1.metric.labour_credit.label'),
        value: labourCredit,
        category: 'credits',
        tone: 'positive',
        info: t('box1.metric.labour_credit.info'),
      },
      {
        label: t('box1.metric.net_income.label'),
        value: netIncome,
        category: 'income',
        tone: 'positive',
        info: t('box1.metric.net_income.info'),
      },
    ]
    return detailedTableRows.filter(row => visibleCategories[row.category])
  }, [visibleCategories, grossIncome, taxableIncome, taxFree, payrollTax, socialTax, generalCredit, labourCredit, netIncome, t])

  return (
    <div className="box1-result">
      <header className="box1-result__header">
        <div className="box1-result__title-row">
          <h2>{t('box1.results.title')}</h2>
        </div>
        <div className="box1-result__meta">
          <span className="box1-result__badge">{t('box1.results.tax_year', { year })}</span>
          <span className="box1-result__badge box1-result__badge--neutral">{allowanceLabel}</span>
          <span className="box1-result__badge box1-result__badge--neutral">{socialSecurityLabel}</span>
        </div>
      </header>

      {/* Period Toggle */}
      <div className="box1-result__period-toggle" role="tablist" aria-label="View period">
        {periodOptions.map(option => (
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
      <section className="box1-result__breakdown" aria-label="Calculation breakdown">
        <div className="box1-result__breakdown-header">
          <h3>{t('box1.results.breakdown.title')}</h3>
          <button
            type="button"
            className="box1-result__toggle"
            onClick={() => setIsBreakdownOpen((prev) => !prev)}
            aria-expanded={isBreakdownOpen}
            aria-controls="box1-result-breakdown-content"
          >
            {isBreakdownOpen ? t('box1.results.breakdown.hide') : t('box1.results.breakdown.show')}
          </button>
        </div>

        <div 
          id="box1-result-breakdown-content" 
          className={`box1-result__breakdown-content${isBreakdownOpen ? ' box1-result__breakdown-content--open' : ''}`}
        >
          <div className="box1-result__breakdown-inner">
            <div className="box1-result__filter-group" role="group" aria-label="Filter components">
              {Object.entries(categoryLabels).map(([key, label]) => (
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
                    <th>{t('box1.results.table.component')}</th>
                    <th>{periodOptions.find(p => p.key === viewPeriod)?.label ?? t('box1.results.table.amount')}</th>
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
