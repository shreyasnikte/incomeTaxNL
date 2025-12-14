/**
 * Income period options for Box 1 calculator
 */
export const INCOME_PERIODS = [
  { value: 'yearly', labelKey: 'constants.income_periods.yearly' },
  { value: 'monthly', labelKey: 'constants.income_periods.monthly' },
  { value: 'weekly', labelKey: 'constants.income_periods.weekly' },
  { value: 'daily', labelKey: 'constants.income_periods.daily' },
  { value: 'hourly', labelKey: 'constants.income_periods.hourly' },
]

/**
 * 30% ruling category options
 * - researchWorker: Scientific research workers
 * - youngProfessional: Young employees with Master's degree
 * - other: Other cases
 */
export const RULING_30_CATEGORIES = [
  { value: 'researchWorker', labelKey: 'constants.ruling_30_categories.research_worker' },
  { value: 'youngProfessional', labelKey: 'constants.ruling_30_categories.young_professional' },
  { value: 'other', labelKey: 'constants.ruling_30_categories.other' },
]

/**
 * Conversion factors for different periods to yearly
 * Based on dutch-tax-income-calculator constants:
 * - 52 working weeks
 * - 260 working days (52 * 5)
 */
export const PERIOD_MULTIPLIERS = {
  yearly: 1,
  monthly: 12,
  weekly: 52,
  daily: 260,
  hourly: null, // Calculated based on hours per week: hoursPerWeek * 52
}

/**
 * Default empty form values for Box 1 income tax calculator
 */
export const BOX1_EMPTY_FORM = {
  grossIncome: '',
  period: 'yearly',
  hoursPerWeek: 40,
  holidayAllowanceIncluded: true,
  older: false,
  ruling30Enabled: false,
  ruling30Category: 'other',
  socialSecurity: true,
}
