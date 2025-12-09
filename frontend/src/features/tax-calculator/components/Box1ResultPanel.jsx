import { useState, useMemo, memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { box1InputsPropType, box1SummaryPropType } from '../../../utils/propTypes.js'
import { formatEuro } from '../../../utils/formatters.js'
import './Box1ResultPanel.css'

const PERIOD_OPTIONS = [
  { key: 'weekly', label: 'Weekly', divisor: 52 },
  { key: 'monthly', label: 'Monthly', divisor: 12 },
  { key: 'yearly', label: 'Yearly', divisor: 1 },
]

const COMPONENT_CATEGORIES = {
  income: { label: 'Income', default: true },
  taxes: { label: 'Taxes', default: true },
  credits: { label: 'Tax Credits', default: true },
  deductions: { label: 'Deductions', default: true },
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
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false)
  const [viewPeriod, setViewPeriod] = useState('yearly')
  const [visibleCategories, setVisibleCategories] = useState(() => 
    Object.fromEntries(Object.entries(COMPONENT_CATEGORIES).map(([key, val]) => [key, val.default]))
  )

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
  , [viewPeriod])

  const periodLabel = useMemo(() => {
    const labels = { weekly: 'per week', monthly: 'per month', yearly: 'per year' }
    return labels[viewPeriod] ?? 'per year'
  }, [viewPeriod])

  const formatForPeriod = useCallback((value) => 
    formatEuro(value / periodDivisor)
  , [periodDivisor])

  const allowanceLabel = inputs.ruling30Enabled ? 'With 30% ruling' : 'Without 30% ruling'
  const socialSecurityLabel = inputs.socialSecurity ? 'Incl. social security' : 'Excl. social security'

  const primaryMetrics = [
    {
      key: 'gross',
      label: 'Gross Income',
      value: grossIncome,
      sublabel: periodLabel,
      tone: 'neutral',
      info: 'Your total income before any deductions.',
    },
    {
      key: 'net',
      label: 'Net Income',
      value: netIncome,
      sublabel: periodLabel,
      tone: 'positive',
      info: 'Your take-home pay after all taxes and deductions.',
    },
    {
      key: 'tax',
      label: 'Total Tax',
      value: Math.abs(incomeTax),
      sublabel: `${periodLabel} · ${effectiveTaxRate.toFixed(1)}% effective rate`,
      tone: 'negative',
      info: 'Total income tax including payroll tax, social security, minus credits.',
    },
  ]

  const filteredTableRows = useMemo(() => {
    const detailedTableRows = [
      {
        label: 'Gross Income',
        value: grossIncome,
        category: 'income',
        tone: 'neutral',
        info: 'Your total annual income before any deductions.',
      },
      {
        label: '30% Ruling Tax Free',
        value: taxFree,
        category: 'deductions',
        tone: 'positive',
        info: 'Tax-free allowance under the 30% ruling.',
      },
      {
        label: 'Taxable Income',
        value: taxableIncome,
        category: 'income',
        tone: 'neutral',
        info: 'Income subject to taxation (after 30% ruling if applicable).',
      },
      {
        label: 'Payroll Tax',
        value: payrollTax,
        category: 'taxes',
        tone: 'negative',
        info: 'Income tax withheld from your salary.',
      },
      {
        label: 'Social Security',
        value: socialTax,
        category: 'taxes',
        tone: 'negative',
        info: 'Contributions for AOW, ANW, and WLZ.',
      },
      {
        label: 'General Tax Credit',
        value: generalCredit,
        category: 'credits',
        tone: 'positive',
        info: 'Algemene heffingskorting - basic tax credit for all taxpayers.',
      },
      {
        label: 'Labour Tax Credit',
        value: labourCredit,
        category: 'credits',
        tone: 'positive',
        info: 'Arbeidskorting - credit for employed taxpayers.',
      },
      {
        label: 'Net Income',
        value: netIncome,
        category: 'income',
        tone: 'positive',
        info: 'Your take-home pay after all taxes and deductions.',
      },
    ]
    return detailedTableRows.filter(row => visibleCategories[row.category])
  }, [visibleCategories, grossIncome, taxableIncome, taxFree, payrollTax, socialTax, generalCredit, labourCredit, netIncome])

  return (
    <div className="box1-result">
      <header className="box1-result__header">
        <div className="box1-result__title-row">
          <h2>Results</h2>
        </div>
        <div className="box1-result__meta">
          <span className="box1-result__badge">Tax year {year}</span>
          <span className="box1-result__badge box1-result__badge--neutral">{allowanceLabel}</span>
          <span className="box1-result__badge box1-result__badge--neutral">{socialSecurityLabel}</span>
        </div>
      </header>

      {/* Period Toggle */}
      <div className="box1-result__period-toggle" role="tablist" aria-label="View period">
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
      <section className="box1-result__breakdown" aria-label="Calculation breakdown">
        <div className="box1-result__breakdown-header">
          <h3>Calculation breakdown</h3>
          <button
            type="button"
            className="box1-result__toggle"
            onClick={() => setIsBreakdownOpen((prev) => !prev)}
            aria-expanded={isBreakdownOpen}
            aria-controls="box1-result-breakdown-content"
          >
            {isBreakdownOpen ? 'Hide breakdown' : 'Show breakdown'}
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
                    <th>Component</th>
                    <th>{PERIOD_OPTIONS.find(p => p.key === viewPeriod)?.label ?? 'Amount'}</th>
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

      <footer className="box1-result__footer">
        <p>
          Salary calculations powered by the <a href="https://github.com/stevermeister/dutch-tax-income-calculator" target="_blank" rel="noopener noreferrer">dutch-tax-income-calculator</a> library — <a href="https://buymeacoffee.com/stevermeister" target="_blank" rel="noopener noreferrer">buy the author a coffee ☕</a>
        </p>
      </footer>
    </div>
  )
}

Box1ResultPanel.propTypes = {
  inputs: box1InputsPropType.isRequired,
  summary: box1SummaryPropType.isRequired,
  year: PropTypes.number.isRequired,
}

export default Box1ResultPanel
