import { useState } from 'react'
import PropTypes from 'prop-types'
import { formatEuro } from '../../../utils/formatters.js'
import { useLanguage } from '../../../context/LanguageContext.jsx'
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

function Box1Explanation({ inputs, summary, t }) {
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
          {t('explanation.exampleNoteBox1')} <strong>{formatEuro(BOX1_DEFAULTS.grossIncome)}</strong>. {t('explanation.exampleNoteBox1End')}
        </p>
      )}

      <section className="explanation__section">
        <h4>{t('explanation.understandingBox1Title')}</h4>
        <p>
          {t('explanation.understandingBox1Text')} <strong>{formatEuro(values.grossIncome)}</strong>. {t('explanation.understandingBox1TextEnd')}
        </p>
      </section>

      {values.grossAllowance > 0 && (
        <section className="explanation__section">
          <h4>{t('explanation.holidayAllowanceTitle')}</h4>
          <p>
            {t('explanation.holidayAllowanceText')}
            {hasUserInput 
              ? ` ${t('explanation.holidayAllowanceUserText')} ${formatEuro(values.grossAllowance)} ${t('explanation.holidayAllowanceUserTextEnd')}`
              : ` ${t('explanation.holidayAllowanceExampleText')} ${formatEuro(values.grossIncome)} ${t('explanation.holidayAllowanceExampleTextEnd')} ${formatEuro(values.grossAllowance)}.`
            }
          </p>
        </section>
      )}

      {values.taxFree > 0 && (
        <section className="explanation__section">
          <h4>{t('explanation.ruling30Title')}</h4>
          <p>
            {t('explanation.ruling30Text')} <strong>{formatEuro(values.taxFree)}</strong> {t('explanation.ruling30TextEnd')}
          </p>
        </section>
      )}

      <section className="explanation__section">
        <h4>{t('explanation.taxableIncomeTitle')}</h4>
        <p>
          {t('explanation.taxableIncomeText')} <strong>{formatEuro(values.taxableYear)}</strong>. {t('explanation.taxableIncomeTextEnd')}
        </p>
      </section>

      <section className="explanation__section">
        <h4>{t('explanation.taxBracketsTitle')}</h4>
        <p>
          {t('explanation.taxBracketsText')} <strong>{formatEuro(values.payrollTax)}</strong>.
        </p>
      </section>

      {values.socialTax > 0 && (
        <section className="explanation__section">
          <h4>{t('explanation.socialSecurityTitle')}</h4>
          <p>
            {t('explanation.socialSecurityText')} <strong>{formatEuro(values.socialTax)}</strong> {t('explanation.socialSecurityTextEnd')}
          </p>
        </section>
      )}

      <section className="explanation__section">
        <h4>{t('explanation.taxCreditsTitle')}</h4>
        <p>
          {t('explanation.taxCreditsText')} <strong>{formatEuro(values.generalCredit)}</strong> {t('explanation.taxCreditsLabourText')} <strong>{formatEuro(values.labourCredit)}</strong>. {t('explanation.taxCreditsTotalText')} <strong>{formatEuro(totalCredits)}</strong> {t('explanation.taxCreditsTotalTextEnd')}
        </p>
      </section>

      <section className="explanation__section explanation__section--result">
        <h4>{t('explanation.takeHomeTitle')}</h4>
        <p>
          {t('explanation.takeHomeText')} <strong className="explanation__highlight">{formatEuro(values.netYear)}</strong>. {t('explanation.takeHomeMonthlyText')} <strong>{formatEuro(values.netYear / 12)}</strong> {t('explanation.takeHomeMonthlyTextEnd')}
        </p>
        <p>
          {t('explanation.effectiveRateText')} <strong>{effectiveRate}%</strong>, {t('explanation.effectiveRateTextEnd')}
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
  t: PropTypes.func.isRequired,
}

function Box3Explanation({ inputs, summary, config, t }) {
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
          {t('explanation.exampleNoteBox3Part1')} <strong>{formatEuro(BOX3_DEFAULTS.bankBalance)}</strong> {t('explanation.exampleNoteBox3InSavings')} <strong>{formatEuro(BOX3_DEFAULTS.investmentAssets)}</strong> {t('explanation.exampleNoteBox3InInvestments')}
        </p>
      )}

      <section className="explanation__section">
        <h4>{t('explanation.understandingBox3Title')}</h4>
        <p>
          {t('explanation.understandingBox3Text')}
        </p>
      </section>

      <section className="explanation__section">
        <h4>{t('explanation.totalAssetsTitle')}</h4>
        <p>
          {t('explanation.totalAssetsText')} {hasUserInput ? t('explanation.totalAssetsUserPrefix') : t('explanation.totalAssetsExamplePrefix')} {t('explanation.totalAssetsInclude')} <strong>{formatEuro(values.bankBalance)}</strong> {t('explanation.totalAssetsInBank')} <strong>{formatEuro(values.investmentAssets)}</strong> {t('explanation.totalAssetsInInvestments')} <strong>{formatEuro(values.totalAssets)}</strong>.
          {values.debts > 0 && (
            <> {t('explanation.totalAssetsDebtsText')} {formatEuro(values.debts)}, {t('explanation.totalAssetsDebtsEnd')} <strong>{formatEuro(netAssets)}</strong>.</>
          )}
        </p>
      </section>

      <section className="explanation__section">
        <h4>{t('explanation.taxFreeAllowanceTitle')}</h4>
        <p>
          {t('explanation.taxFreeAllowanceText')} <strong>{formatEuro(values.taxFreeAllowance)}</strong> {t('explanation.taxFreeAllowanceTextEnd')}
          {values.hasTaxPartner && (
            <> {t('explanation.taxFreeAllowancePartnerText')}</>
          )}
        </p>
      </section>

      <section className="explanation__section">
        <h4>{t('explanation.taxableCapitalTitle')}</h4>
        <p>
          {t('explanation.taxableCapitalText')} <strong>{formatEuro(Math.max(0, values.taxableBase))}</strong>. {t('explanation.taxableCapitalTextEnd')}
        </p>
      </section>

      <section className="explanation__section">
        <h4>{t('explanation.fictitiousReturnTitle')}</h4>
        <p>
          {t('explanation.fictitiousReturnText')} <strong>{formatEuro(values.fictitiousReturn)}</strong> {t('explanation.fictitiousReturnTextEnd')}
        </p>
      </section>

      <section className="explanation__section explanation__section--result">
        <h4>{t('explanation.box3TaxTitle')}</h4>
        <p>
          {t('explanation.box3TaxText')} {formatEuro(values.fictitiousReturn)} {t('explanation.box3TaxRateText')} {taxRate}%. {t('explanation.box3TaxResultText')} <strong className="explanation__highlight">{formatEuro(values.estimatedTax)}</strong> {t('explanation.box3TaxResultTextEnd')}
        </p>
        <p>
          {t('explanation.box3TaxNote')}
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
  t: PropTypes.func.isRequired,
}

function CalculationExplanation({ boxType, box1Inputs, box1Summary, box3Inputs, box3Summary, box3Config }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useLanguage()

  return (
    <div className="explanation">
      <button
        className="explanation__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="explanation__toggle-icon">{isExpanded ? '−' : '+'}</span>
        <span className="explanation__toggle-text">
          {isExpanded ? t('explanation.hideExplanation') : t('explanation.showExplanation')}
        </span>
        <span className="explanation__toggle-hint">
          {boxType === 'box1' ? t('explanation.box1Hint') : t('explanation.box3Hint')}
        </span>
      </button>

      {isExpanded && (
        <div className="explanation__body">
          <h3 className="explanation__title">
            {boxType === 'box1' ? t('explanation.box1Title') : t('explanation.box3Title')}
          </h3>
          {boxType === 'box1' ? (
            <Box1Explanation inputs={box1Inputs} summary={box1Summary} t={t} />
          ) : (
            <Box3Explanation inputs={box3Inputs} summary={box3Summary} config={box3Config} t={t} />
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
