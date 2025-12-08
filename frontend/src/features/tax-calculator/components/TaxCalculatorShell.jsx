import { useState } from 'react'
import TaxInputForm from './TaxInputForm.jsx'
import TaxResultPanel from './TaxResultPanel.jsx'
import ConfigurationMenu from './ConfigurationMenu.jsx'
import { useBox3Calculator } from '../hooks/useBox3Calculator.js'
import { BOX3_DEFAULTS, DEFAULT_YEAR, getDefaultsForYear } from '../constants/box3Defaults.js'
import './TaxCalculatorShell.css'

const EMPTY_FORM = {
  bankAccounts: [],
  investmentAccounts: [],
  debts: [],
  hasTaxPartner: false,
}

function TaxCalculatorShell() {
  const [formValues, setFormValues] = useState(EMPTY_FORM)
  const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR)
  const [box3Config, setBox3Config] = useState(BOX3_DEFAULTS)

  const handleFieldChange = (name, value) => {
    setFormValues((current) => ({ ...current, [name]: value }))
  }

  const handleYearChange = (newYear) => {
    setSelectedYear(newYear)
    // Update config with the new year's defaults
    const yearDefaults = getDefaultsForYear(newYear)
    setBox3Config({ year: newYear, ...yearDefaults })
  }

  const bankBalance = (formValues.bankAccounts ?? []).reduce(
    (sum, entry) => sum + (Number(entry?.amount ?? entry) || 0),
    0,
  )
  const investmentAssets = (formValues.investmentAccounts ?? []).reduce(
    (sum, entry) => sum + (Number(entry?.amount ?? entry) || 0),
    0,
  )
  const debts = (formValues.debts ?? []).reduce(
    (sum, entry) => sum + (Number(entry?.amount ?? entry) || 0),
    0,
  )

  const calculatorInputs = {
    bankBalance,
    investmentAssets,
    debts,
    hasTaxPartner: formValues.hasTaxPartner,
  }

  const summary = useBox3Calculator(calculatorInputs, box3Config)

  return (
    <section className="calculator-shell">
      <header className="calculator-shell__header">
        <h1 className="calculator-shell__title">Dutch Box 3 Tax Calculator</h1>
        <ConfigurationMenu config={box3Config} onConfigChange={setBox3Config} />
      </header>
      <div className="calculator-shell__content">
        <div className="calculator-panel">
          <TaxInputForm
            values={formValues}
            onChange={handleFieldChange}
            year={selectedYear}
            onYearChange={handleYearChange}
          />
        </div>
        <div className="calculator-panel">
          <TaxResultPanel inputs={calculatorInputs} summary={summary} config={box3Config} />
        </div>
      </div>
    </section>
  )
}

export default TaxCalculatorShell
