import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import TaxInputForm from './TaxInputForm.jsx'
import Box1InputForm from './Box1InputForm.jsx'
import CalculatorToggleSwitch from './CalculatorToggleSwitch.jsx'
import { useBox3Calculator } from '../hooks/useBox3Calculator.js'
import { BOX1_EMPTY_FORM } from '../constants/box1Defaults.js'
import { useBox1Calculator, BOX1_AVAILABLE_YEARS } from '../hooks/useBox1Calculator.js'
import { BOX3_DEFAULTS, DEFAULT_YEAR, getDefaultsForYear } from '../constants/box3Defaults.js'
import { storage, STORAGE_KEYS } from '../../../utils/storage.js'
import './TaxCalculatorShell.css'
import './CalculatorToggleSwitch.css'

// Lazy load components for better initial bundle size
const ConfigurationMenu = lazy(() => import('./ConfigurationMenu.jsx'))
const TaxResultPanel = lazy(() => import('./TaxResultPanel.jsx'))
const Box1ResultPanel = lazy(() => import('./Box1ResultPanel.jsx'))

const BOX3_EMPTY_FORM = {
  bankAccounts: [],
  investmentAccounts: [],
  debts: [],
  hasTaxPartner: false,
}

/**
 * Load initial box type from localStorage, falling back to 'box1'.
 */
const getInitialBoxType = () => {
  const saved = storage.get(STORAGE_KEYS.SELECTED_BOX_TYPE)
  return saved === 'box1' || saved === 'box3' ? saved : 'box3'
}

/**
 * Load initial Box 3 form values from localStorage, falling back to empty form.
 */
const getInitialBox3FormValues = () => {
  const saved = storage.get(STORAGE_KEYS.FORM_VALUES)
  if (saved && typeof saved === 'object') {
    return {
      bankAccounts: Array.isArray(saved.bankAccounts) ? saved.bankAccounts : [],
      investmentAccounts: Array.isArray(saved.investmentAccounts) ? saved.investmentAccounts : [],
      debts: Array.isArray(saved.debts) ? saved.debts : [],
      hasTaxPartner: Boolean(saved.hasTaxPartner),
    }
  }
  return BOX3_EMPTY_FORM
}

/**
 * Load initial Box 1 form values from localStorage, falling back to empty form.
 */
const getInitialBox1FormValues = () => {
  const saved = storage.get(STORAGE_KEYS.BOX1_FORM_VALUES)
  if (saved && typeof saved === 'object') {
    return {
      grossIncome: typeof saved.grossIncome === 'number' ? saved.grossIncome : '',
      period: saved.period || 'yearly',
      hoursPerWeek: typeof saved.hoursPerWeek === 'number' ? saved.hoursPerWeek : 40,
      holidayAllowanceIncluded: saved.holidayAllowanceIncluded !== false, // default to true
      older: Boolean(saved.older),
      ruling30Enabled: Boolean(saved.ruling30Enabled),
      ruling30Category: saved.ruling30Category || 'other',
      socialSecurity: saved.socialSecurity !== false, // default to true
    }
  }
  return BOX1_EMPTY_FORM
}

/**
 * Load initial year from localStorage, falling back to default.
 */
const getInitialYear = () => {
  const saved = storage.get(STORAGE_KEYS.SELECTED_YEAR)
  return typeof saved === 'number' ? saved : DEFAULT_YEAR
}

/**
 * Load initial box3 config from localStorage, falling back to defaults.
 */
const getInitialBox3Config = () => {
  const savedYear = getInitialYear()
  const yearDefaults = getDefaultsForYear(savedYear)
  return { year: savedYear, ...yearDefaults }
}

function TaxCalculatorShell() {
  // Box type state (box1 or box3)
  const [boxType, setBoxType] = useState(getInitialBoxType)
  
  // Box 3 state
  const [box3FormValues, setBox3FormValues] = useState(getInitialBox3FormValues)
  const [box3SelectedYear, setBox3SelectedYear] = useState(getInitialYear)
  const [box3Config, setBox3Config] = useState(getInitialBox3Config)
  
  // Box 1 state
  const [box1FormValues, setBox1FormValues] = useState(getInitialBox1FormValues)
  const [box1SelectedYear, setBox1SelectedYear] = useState(() => {
    const saved = storage.get(STORAGE_KEYS.SELECTED_YEAR)
    // Ensure the year is valid for Box 1
    if (typeof saved === 'number' && BOX1_AVAILABLE_YEARS.includes(saved)) {
      return saved
    }
    return BOX1_AVAILABLE_YEARS[0] // Default to most recent year
  })

  // Persist box type to localStorage
  useEffect(() => {
    storage.set(STORAGE_KEYS.SELECTED_BOX_TYPE, boxType)
  }, [boxType])

  // Persist Box 3 form values to localStorage whenever they change
  useEffect(() => {
    storage.set(STORAGE_KEYS.FORM_VALUES, box3FormValues)
  }, [box3FormValues])

  // Persist Box 1 form values to localStorage whenever they change
  useEffect(() => {
    storage.set(STORAGE_KEYS.BOX1_FORM_VALUES, box1FormValues)
  }, [box1FormValues])

  // Box 3: Persist selected year to localStorage whenever it changes
  useEffect(() => {
    storage.set(STORAGE_KEYS.SELECTED_YEAR, box3SelectedYear)
  }, [box3SelectedYear])

  // Box type change handler
  const handleBoxTypeChange = useCallback((_event, newBoxType) => {
    if (newBoxType !== null) {
      setBoxType(newBoxType)
    }
  }, [])

  // Box 3 handlers
  const handleBox3FieldChange = useCallback((name, value) => {
    setBox3FormValues((current) => ({ ...current, [name]: value }))
  }, [])

  const handleBox3YearChange = useCallback((newYear) => {
    setBox3SelectedYear(newYear)
    // Update config with the new year's defaults
    const yearDefaults = getDefaultsForYear(newYear)
    setBox3Config({ year: newYear, ...yearDefaults })
  }, [])

  const handleBox3Reset = useCallback(() => {
    setBox3FormValues(BOX3_EMPTY_FORM)
    setBox3SelectedYear(DEFAULT_YEAR)
    const yearDefaults = getDefaultsForYear(DEFAULT_YEAR)
    setBox3Config({ year: DEFAULT_YEAR, ...yearDefaults })
  }, [])

  // Box 1 handlers
  const handleBox1FieldChange = useCallback((name, value) => {
    setBox1FormValues((current) => ({ ...current, [name]: value }))
  }, [])

  const handleBox1YearChange = useCallback((newYear) => {
    setBox1SelectedYear(newYear)
  }, [])

  const handleBox1Reset = useCallback(() => {
    setBox1FormValues(BOX1_EMPTY_FORM)
    setBox1SelectedYear(BOX1_AVAILABLE_YEARS[0])
  }, [])

  // Box 3: Memoize calculated values to prevent unnecessary recalculations
  const bankBalance = useMemo(
    () =>
      (box3FormValues.bankAccounts ?? []).reduce(
        (sum, entry) => sum + (Number(entry?.amount ?? entry) || 0),
        0,
      ),
    [box3FormValues.bankAccounts],
  )

  const investmentAssets = useMemo(
    () =>
      (box3FormValues.investmentAccounts ?? []).reduce(
        (sum, entry) => sum + (Number(entry?.amount ?? entry) || 0),
        0,
      ),
    [box3FormValues.investmentAccounts],
  )

  const debts = useMemo(
    () =>
      (box3FormValues.debts ?? []).reduce(
        (sum, entry) => sum + (Number(entry?.amount ?? entry) || 0),
        0,
      ),
    [box3FormValues.debts],
  )

  // Box 3: Memoize calculator inputs to ensure stable reference for useBox3Calculator
  const box3CalculatorInputs = useMemo(
    () => ({
      bankBalance,
      investmentAssets,
      debts,
      hasTaxPartner: box3FormValues.hasTaxPartner,
    }),
    [bankBalance, investmentAssets, debts, box3FormValues.hasTaxPartner],
  )

  const box3Summary = useBox3Calculator(box3CalculatorInputs, box3Config)

  // Box 1: Memoize calculator inputs
  const box1CalculatorInputs = useMemo(
    () => ({
      grossIncome: Number(box1FormValues.grossIncome) || 0,
      period: box1FormValues.period,
      hoursPerWeek: box1FormValues.hoursPerWeek,
      holidayAllowanceIncluded: box1FormValues.holidayAllowanceIncluded,
      older: box1FormValues.older,
      ruling30Enabled: box1FormValues.ruling30Enabled,
      ruling30Category: box1FormValues.ruling30Category,
      socialSecurity: box1FormValues.socialSecurity,
    }),
    [box1FormValues],
  )

  const box1Summary = useBox1Calculator(box1CalculatorInputs, box1SelectedYear)

  // Determine title based on box type
  const title = boxType === 'box1' ? 'Dutch Salary Calculator' : 'Dutch Capital Gains Tax (Box 3) Calculator'

  return (
    <section className="calculator-shell">
      <header className="calculator-shell__header">
        <div className="calculator-shell__title-row">
          {/* Title removed as requested */}
        </div>
        <div className="calculator-shell__tool-desc">
          {/* Description removed as requested */}
        </div>
      </header>
      <div className="calculator-shell__content">
        <div className="calculator-panel">
          {/* Toggle switch above the input panel */}
          <CalculatorToggleSwitch value={boxType} onChange={handleBoxTypeChange} />
          {boxType === 'box1' ? (
            <Box1InputForm
              values={box1FormValues}
              onChange={handleBox1FieldChange}
              year={box1SelectedYear}
              onYearChange={handleBox1YearChange}
              onReset={handleBox1Reset}
            />
          ) : (
            <TaxInputForm
              values={box3FormValues}
              onChange={handleBox3FieldChange}
              year={box3SelectedYear}
              onYearChange={handleBox3YearChange}
              onReset={handleBox3Reset}
              configMenu={
                <Suspense fallback={<div className="config-menu-placeholder" />}>
                  <ConfigurationMenu config={box3Config} onConfigChange={setBox3Config} />
                </Suspense>
              }
            />
          )}
        </div>
        <div className="calculator-panel calculator-panel--results">
          <Suspense fallback={<div className="results-panel-placeholder">Loading results...</div>}>
            {boxType === 'box1' ? (
              <Box1ResultPanel
                inputs={box1CalculatorInputs}
                summary={box1Summary}
                year={box1SelectedYear}
              />
            ) : (
              <TaxResultPanel
                inputs={box3CalculatorInputs}
                summary={box3Summary}
                config={box3Config}
              />
            )}
          </Suspense>
        </div>
      </div>
      {/* Remove old footer switch buttons, toggle is now above input panel */}
    </section>
  )
}

export default TaxCalculatorShell
