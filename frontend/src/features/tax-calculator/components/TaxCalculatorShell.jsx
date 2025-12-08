import { useState, useMemo, useCallback, lazy, Suspense } from 'react'
import TaxInputForm from './TaxInputForm.jsx'
import { useBox3Calculator } from '../hooks/useBox3Calculator.js'
import { BOX3_DEFAULTS, DEFAULT_YEAR, getDefaultsForYear } from '../constants/box3Defaults.js'
import './TaxCalculatorShell.css'

// Lazy load components for better initial bundle size
const ConfigurationMenu = lazy(() => import('./ConfigurationMenu.jsx'))
const TaxResultPanel = lazy(() => import('./TaxResultPanel.jsx'))

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

  const handleFieldChange = useCallback((name, value) => {
    setFormValues((current) => ({ ...current, [name]: value }))
  }, [])

  const handleYearChange = useCallback((newYear) => {
    setSelectedYear(newYear)
    // Update config with the new year's defaults
    const yearDefaults = getDefaultsForYear(newYear)
    setBox3Config({ year: newYear, ...yearDefaults })
  }, [])

  // Memoize calculated values to prevent unnecessary recalculations
  const bankBalance = useMemo(
    () =>
      (formValues.bankAccounts ?? []).reduce(
        (sum, entry) => sum + (Number(entry?.amount ?? entry) || 0),
        0,
      ),
    [formValues.bankAccounts],
  )

  const investmentAssets = useMemo(
    () =>
      (formValues.investmentAccounts ?? []).reduce(
        (sum, entry) => sum + (Number(entry?.amount ?? entry) || 0),
        0,
      ),
    [formValues.investmentAccounts],
  )

  const debts = useMemo(
    () =>
      (formValues.debts ?? []).reduce(
        (sum, entry) => sum + (Number(entry?.amount ?? entry) || 0),
        0,
      ),
    [formValues.debts],
  )

  // Memoize calculator inputs to ensure stable reference for useBox3Calculator
  const calculatorInputs = useMemo(
    () => ({
      bankBalance,
      investmentAssets,
      debts,
      hasTaxPartner: formValues.hasTaxPartner,
    }),
    [bankBalance, investmentAssets, debts, formValues.hasTaxPartner],
  )

  const summary = useBox3Calculator(calculatorInputs, box3Config)

  return (
    <section className="calculator-shell">
      <header className="calculator-shell__header">
        <h1 className="calculator-shell__title">Dutch Box 3 Tax Calculator</h1>
        <Suspense fallback={<div className="config-menu-placeholder" />}>
          <ConfigurationMenu config={box3Config} onConfigChange={setBox3Config} />
        </Suspense>
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
        <div className="calculator-panel calculator-panel--results">
          <Suspense fallback={<div className="results-panel-placeholder">Loading results...</div>}>
            <TaxResultPanel inputs={calculatorInputs} summary={summary} config={box3Config} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}

export default TaxCalculatorShell
