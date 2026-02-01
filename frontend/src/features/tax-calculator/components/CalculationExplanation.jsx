import { useState } from 'react'
import PropTypes from 'prop-types'
import { formatEuro } from '../../../utils/formatters.js'
import './CalculationExplanation.css'

// Default example values when user hasn't entered anything
const BOX1_DEFAULTS = {
  grossIncome: 60000,
  taxableYear: 60000,
  grossAllowance: 4800,
  payrollTax: 22000,
  socialTax: 0,
  generalCredit: 3362,
  labourCredit: 5532,
  incomeTax: 13106,
  netYear: 46894,
}

const BOX3_DEFAULTS = {
  bankBalance: 50000,
  investmentAssets: 100000,
  debts: 0,
  totalAssets: 150000,
  taxFreeAllowance: 57000,
  taxableBase: 93000,
  fictitiousReturn: 5765,
  estimatedTax: 1961,
}

function Box1Explanation({ inputs, summary }) {
  const hasUserInput = inputs?.grossIncome > 0
  const details = summary?.details || {}

  const values = hasUserInput
    ? {
        grossIncome: details.grossYear || inputs.grossIncome,
        taxableYear: details.taxableYear || 0,
        grossAllowance: details.grossAllowance || 0,
        payrollTax: details.payrollTax || 0,
        socialTax: details.socialTax || 0,
        generalCredit: details.generalCredit || 0,
        labourCredit: details.labourCredit || 0,
        incomeTax: details.incomeTax || 0,
        netYear: details.netYear || 0,
        taxFree: details.taxFree || 0,
      }
    : BOX1_DEFAULTS

  const isExample = !hasUserInput
  const totalCredits = values.generalCredit + values.labourCredit
  const effectiveRate = values.grossIncome > 0 
    ? ((Math.abs(values.incomeTax) / values.grossIncome) * 100).toFixed(1) 
    : 0

  return (
    <article className="explanation__article">
      {isExample && (
        <p className="explanation__example-note">
          The following example uses a yearly salary of <strong>{formatEuro(BOX1_DEFAULTS.grossIncome)}</strong>. Enter your income above to see your personalized calculation.
        </p>
      )}

      <section className="explanation__section">
        <h4>Understanding Dutch Income Tax (Box 1)</h4>
        <p>
          In the Netherlands, income from employment is taxed under Box 1. The calculation starts with your 
          gross annual income of <strong>{formatEuro(values.grossIncome)}</strong>. This is your total salary 
          before any taxes or deductions are applied.
        </p>
      </section>

      {values.grossAllowance > 0 && (
        <section className="explanation__section">
          <h4>Holiday Allowance</h4>
          <p>
            Dutch employees typically receive an 8% holiday allowance (vakantiegeld) on top of their base salary. 
            {hasUserInput 
              ? ` In your case, this adds ${formatEuro(values.grossAllowance)} to your annual compensation.`
              : ` For a ${formatEuro(values.grossIncome)} salary, this amounts to ${formatEuro(values.grossAllowance)}.`
            }
          </p>
        </section>
      )}

      {values.taxFree > 0 && (
        <section className="explanation__section">
          <h4>30% Ruling Benefit</h4>
          <p>
            With the 30% ruling for highly skilled migrants, <strong>{formatEuro(values.taxFree)}</strong> of 
            your income is tax-free. This significantly reduces your taxable base and is one of the most 
            valuable tax benefits available to expats in the Netherlands.
          </p>
        </section>
      )}

      <section className="explanation__section">
        <h4>Taxable Income</h4>
        <p>
          After applying any exemptions, your taxable income is <strong>{formatEuro(values.taxableYear)}</strong>. 
          This is the amount on which the Dutch tax authority (Belastingdienst) calculates your income tax.
        </p>
      </section>

      <section className="explanation__section">
        <h4>Tax Brackets and Payroll Tax</h4>
        <p>
          The Netherlands uses a progressive tax system with two main brackets: income up to approximately 
          75,000 euros is taxed at 36.97%, while income above this threshold is taxed at 49.5%. Based on 
          your taxable income, the payroll tax (loonheffing) amounts to <strong>{formatEuro(values.payrollTax)}</strong>.
        </p>
      </section>

      {values.socialTax > 0 && (
        <section className="explanation__section">
          <h4>Social Security Contributions</h4>
          <p>
            Additionally, you contribute <strong>{formatEuro(values.socialTax)}</strong> towards Dutch social 
            security programs, including AOW (state pension), ANW (survivor benefits), and WLZ (long-term care). 
            These contributions provide essential social protections.
          </p>
        </section>
      )}

      <section className="explanation__section">
        <h4>Tax Credits Reduce Your Bill</h4>
        <p>
          The Dutch tax system provides valuable credits that directly reduce your tax liability. You receive 
          a general tax credit (algemene heffingskorting) of <strong>{formatEuro(values.generalCredit)}</strong> and 
          a labour tax credit (arbeidskorting) of <strong>{formatEuro(values.labourCredit)}</strong>. Together, 
          these credits save you <strong>{formatEuro(totalCredits)}</strong> in taxes.
        </p>
      </section>

      <section className="explanation__section explanation__section--result">
        <h4>Your Take-Home Pay</h4>
        <p>
          After subtracting taxes and adding back your credits, your net annual income 
          is <strong className="explanation__highlight">{formatEuro(values.netYear)}</strong>. This means you 
          keep approximately <strong>{formatEuro(values.netYear / 12)}</strong> per month.
        </p>
        <p>
          Your effective tax rate is <strong>{effectiveRate}%</strong>, which represents the actual 
          percentage of your gross income that goes to taxes after all credits are applied.
        </p>
      </section>
    </article>
  )
}

Box1Explanation.propTypes = {
  inputs: PropTypes.shape({
    grossIncome: PropTypes.number,
  }),
  summary: PropTypes.shape({
    details: PropTypes.object,
  }),
}

function Box3Explanation({ inputs, summary, config }) {
  const hasUserInput = (inputs?.bankBalance > 0 || inputs?.investmentAssets > 0)
  const breakdown = summary?.breakdown || []

  const getBreakdownValue = (description) => {
    const item = breakdown.find((b) => b.description?.toLowerCase().includes(description.toLowerCase()))
    return item?.amount || 0
  }

  const values = hasUserInput
    ? {
        bankBalance: inputs.bankBalance || 0,
        investmentAssets: inputs.investmentAssets || 0,
        debts: inputs.debts || 0,
        totalAssets: (inputs.bankBalance || 0) + (inputs.investmentAssets || 0),
        taxFreeAllowance: getBreakdownValue('tax-free') || config?.taxFreeAllowance || 57000,
        taxableBase: summary?.taxableBase || 0,
        fictitiousReturn: getBreakdownValue('fictitious return') || getBreakdownValue('deemed return') || 0,
        estimatedTax: summary?.estimatedTax || 0,
        hasTaxPartner: inputs.hasTaxPartner || false,
      }
    : BOX3_DEFAULTS

  const isExample = !hasUserInput
  const taxRate = config?.taxRate || 36
  const netAssets = values.totalAssets - (values.debts || 0)

  return (
    <article className="explanation__article">
      {isExample && (
        <p className="explanation__example-note">
          The following example uses <strong>{formatEuro(BOX3_DEFAULTS.bankBalance)}</strong> in savings 
          and <strong>{formatEuro(BOX3_DEFAULTS.investmentAssets)}</strong> in investments. Enter your assets 
          above to see your personalized calculation.
        </p>
      )}

      <section className="explanation__section">
        <h4>Understanding Dutch Wealth Tax (Box 3)</h4>
        <p>
          In the Netherlands, wealth from savings and investments is taxed under Box 3. Unlike income tax, 
          Box 3 does not tax your actual returns. Instead, the tax authority assumes a fictional return 
          on your assets and taxes that amount.
        </p>
      </section>

      <section className="explanation__section">
        <h4>Calculating Your Total Assets</h4>
        <p>
          Your Box 3 assets are measured as of January 1st of the tax year. 
          {hasUserInput ? ' Your' : ' In this example, the'} total assets 
          include <strong>{formatEuro(values.bankBalance)}</strong> in bank savings 
          and <strong>{formatEuro(values.investmentAssets)}</strong> in investments, 
          bringing the total to <strong>{formatEuro(values.totalAssets)}</strong>.
          {values.debts > 0 && (
            <> After subtracting deductible debts of {formatEuro(values.debts)}, the net 
            assets amount to <strong>{formatEuro(netAssets)}</strong>.</>
          )}
        </p>
      </section>

      <section className="explanation__section">
        <h4>Tax-Free Allowance (Heffingsvrij Vermogen)</h4>
        <p>
          Not all your wealth is taxed. In 2025, the first <strong>{formatEuro(values.taxFreeAllowance)}</strong> of 
          your assets is exempt from Box 3 tax.
          {values.hasTaxPartner && (
            <> Since you have a tax partner, this allowance is shared between you, 
            potentially doubling the household exemption.</>
          )}
        </p>
      </section>

      <section className="explanation__section">
        <h4>Taxable Capital</h4>
        <p>
          After subtracting the tax-free allowance from your net assets, your taxable capital 
          (grondslag sparen en beleggen) is <strong>{formatEuro(Math.max(0, values.taxableBase))}</strong>. 
          This is the base amount used to calculate your fictional return.
        </p>
      </section>

      <section className="explanation__section">
        <h4>Fictitious Return (Forfaitair Rendement)</h4>
        <p>
          The Dutch tax authority calculates a deemed return based on the composition of your assets. 
          Savings typically have a lower assumed return rate than investments. For your asset mix, 
          the calculated fictitious return is <strong>{formatEuro(values.fictitiousReturn)}</strong> per year. 
          This is not your actual return, it is what the government assumes you earned.
        </p>
      </section>

      <section className="explanation__section explanation__section--result">
        <h4>Your Box 3 Tax</h4>
        <p>
          The fictitious return of {formatEuro(values.fictitiousReturn)} is taxed at a flat rate 
          of {taxRate}%. This results in a Box 3 tax 
          of <strong className="explanation__highlight">{formatEuro(values.estimatedTax)}</strong> for 
          the year.
        </p>
        <p>
          Note: If your actual investment returns were lower than the assumed return, you may be paying 
          tax on income you did not actually receive. Recent court rulings have challenged this system, 
          and reforms are expected in coming years.
        </p>
      </section>
    </article>
  )
}

Box3Explanation.propTypes = {
  inputs: PropTypes.shape({
    bankBalance: PropTypes.number,
    investmentAssets: PropTypes.number,
    debts: PropTypes.number,
    hasTaxPartner: PropTypes.bool,
  }),
  summary: PropTypes.shape({
    taxableBase: PropTypes.number,
    estimatedTax: PropTypes.number,
    breakdown: PropTypes.array,
  }),
  config: PropTypes.shape({
    taxFreeAllowance: PropTypes.number,
    taxRate: PropTypes.number,
  }),
}

function CalculationExplanation({ boxType, box1Inputs, box1Summary, box3Inputs, box3Summary, box3Config }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="explanation">
      <button
        className="explanation__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="explanation__toggle-icon">{isExpanded ? '−' : '+'}</span>
        <span className="explanation__toggle-text">
          {isExpanded ? 'Hide' : 'Show'} Calculation Breakdown
        </span>
        <span className="explanation__toggle-hint">
          {boxType === 'box1' ? 'How is your income tax calculated?' : 'How is your wealth tax calculated?'}
        </span>
      </button>

      {isExpanded && (
        <div className="explanation__body">
          <h3 className="explanation__title">
            {boxType === 'box1' ? 'Box 1: Income Tax Calculation' : 'Box 3: Wealth Tax Calculation'}
          </h3>
          {boxType === 'box1' ? (
            <Box1Explanation inputs={box1Inputs} summary={box1Summary} />
          ) : (
            <Box3Explanation inputs={box3Inputs} summary={box3Summary} config={box3Config} />
          )}
        </div>
      )}
    </div>
  )
}

CalculationExplanation.propTypes = {
  boxType: PropTypes.oneOf(['box1', 'box3']).isRequired,
  box1Inputs: PropTypes.object,
  box1Summary: PropTypes.object,
  box3Inputs: PropTypes.object,
  box3Summary: PropTypes.object,
  box3Config: PropTypes.object,
}

export default CalculationExplanation
