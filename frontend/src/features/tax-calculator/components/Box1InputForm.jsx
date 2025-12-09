import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Stack,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  InputAdornment,
  Tooltip,
  Collapse,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { BOX1_AVAILABLE_YEARS } from '../hooks/useBox1Calculator.js'
import {
  BOX1_EMPTY_FORM,
  INCOME_PERIODS,
  RULING_30_CATEGORIES,
} from '../constants/box1Defaults.js'
import './Box1InputForm.css'

function Box1InputForm({ values, onChange, year, onYearChange, onReset }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleInputChange = useCallback((field, value) => {
    onChange(field, value)
  }, [onChange])

  const handleNumberChange = useCallback((field) => (event) => {
    const val = event.target.value
    // Allow empty string for clearing
    if (val === '') {
      handleInputChange(field, '')
      return
    }
    const numVal = parseFloat(val)
    if (!Number.isNaN(numVal) && numVal >= 0) {
      handleInputChange(field, numVal)
    }
  }, [handleInputChange])

  const handleToggleChange = useCallback((field) => (event) => {
    handleInputChange(field, event.target.checked)
  }, [handleInputChange])

  const handleSelectChange = useCallback((field) => (event) => {
    handleInputChange(field, event.target.value)
  }, [handleInputChange])

  // Get income label based on period
  const getIncomeLabel = () => {
    const periodLabels = {
      yearly: 'Annual gross income',
      monthly: 'Monthly gross income',
      weekly: 'Weekly gross income',
      daily: 'Daily gross income',
      hourly: 'Hourly gross income',
    }
    return periodLabels[values.period] || 'Gross income'
  }

  return (
    <form className="box1-form" onSubmit={(e) => e.preventDefault()} noValidate>

      {/* Income, Period, and Advanced Options Switch Row */}
      <div
        className="box1-form__income-row"
        style={{ marginBottom: showAdvanced ? '1.5rem' : '0.5rem' }}
      >
        <TextField
          label={getIncomeLabel()}
          type="number"
          value={values.grossIncome}
          onChange={handleNumberChange('grossIncome')}
          placeholder="e.g. 50000"
          className="box1-form__income-input"
          InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
        />
        <TextField
          select
          size="small"
          label="Period"
          value={values.period}
          onChange={handleSelectChange('period')}
          className="box1-form__period-select"
          aria-label="Income period"
        >
          {INCOME_PERIODS.map((p) => (
            <MenuItem key={p.value} value={p.value}>
              {p.label}
            </MenuItem>
          ))}
        </TextField>
        {/* Advanced Options Switch */}
        <FormControlLabel
          control={
            <Switch
              checked={showAdvanced}
              onChange={() => setShowAdvanced((prev) => !prev)}
              color="primary"
            />
          }
          label="Advanced options"
          className="box1-form__advanced-switch"
        />
      </div>

      {/* Collapse for showing advanced options, including tax year */}
      <Collapse in={showAdvanced}>
        <Stack spacing={3} component={Box} className="box1-form__fields">
          <div className="box1-form__year-row">
            <TextField
              select
              size="small"
              label="Tax year"
              value={year}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="box1-form__year-select"
              aria-label="Tax year"
            >
              {BOX1_AVAILABLE_YEARS.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>
          </div>
          {values.period === 'hourly' && (
            <TextField
              label="Hours per week"
              type="number"
              value={values.hoursPerWeek}
              onChange={handleNumberChange('hoursPerWeek')}
              placeholder="40"
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">hrs</InputAdornment>,
              }}
              helperText="Used to calculate annual income from hourly rate"
            />
          )}

          <Box className="box1-form__toggles">
            <FormControlLabel
              control={
                <Switch
                  checked={values.holidayAllowanceIncluded}
                  onChange={handleToggleChange('holidayAllowanceIncluded')}
                />
              }
              label={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>Holiday allowance included</span>
                  <Tooltip title="If enabled, your gross income already includes the 8% holiday allowance. If disabled, it will be added separately.">
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                </Stack>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={values.older}
                  onChange={handleToggleChange('older')}
                />
              }
              label={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>66 years or older</span>
                  <Tooltip title="Check if you are at or above state pension age (AOW). Different tax rates and no AOW premium apply.">
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                </Stack>
              }
            />

            {/* 30% Ruling Section */}
            <div className="box1-form__ruling-section">
              <FormControlLabel
                control={
                  <Switch
                    checked={values.ruling30Enabled}
                    onChange={handleToggleChange('ruling30Enabled')}
                  />
                }
                label={
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <span>30% ruling</span>
                    <Tooltip title="Tax-free allowance for skilled migrants. 30% of your salary becomes tax-free. Different income thresholds apply based on category.">
                      <InfoOutlinedIcon fontSize="small" color="action" />
                    </Tooltip>
                  </Stack>
                }
              />
              <Collapse in={values.ruling30Enabled}>
                <FormControl component="fieldset" className="box1-form__ruling-options">
                  <FormLabel component="legend" className="box1-form__ruling-legend">
                    Category
                  </FormLabel>
                  <RadioGroup
                    value={values.ruling30Category}
                    onChange={handleSelectChange('ruling30Category')}
                    className="box1-form__ruling-radio-group"
                  >
                    {RULING_30_CATEGORIES.map((cat) => (
                      <FormControlLabel
                        key={cat.value}
                        value={cat.value}
                        control={<Radio size="small" />}
                        label={cat.label}
                        className="box1-form__ruling-radio-label"
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Collapse>
            </div>

            <FormControlLabel
              control={
                <Switch
                  checked={values.socialSecurity}
                  onChange={handleToggleChange('socialSecurity')}
                />
              }
              label={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>Social security</span>
                  <Tooltip title="Include Dutch social security contributions (AOW, ANW, WLZ). Most employees pay these unless exempt.">
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                </Stack>
              }
            />
          </Box>
        </Stack>
      </Collapse>

      {/* Reset button always visible below advanced options */}
      <Box className="box1-form__reset-section">
        <Button
          size="small"
          color="error"
          onClick={() => setShowResetConfirm(true)}
          className="box1-form__reset-button"
          startIcon={<RestartAltIcon fontSize="small" />}
          aria-label="Reset all values"
        >
          Reset
        </Button>
      </Box>

      {/* Reset confirmation dialog */}
      <Dialog open={showResetConfirm} onClose={() => setShowResetConfirm(false)} maxWidth="xs">
        <DialogTitle>Reset all values?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This will clear all your entered data including income, hours, and tax settings. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetConfirm(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onReset()
              setShowResetConfirm(false)
            }}
            variant="contained"
            color="error"
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}

Box1InputForm.propTypes = {
  values: PropTypes.shape({
    grossIncome: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    period: PropTypes.string,
    hoursPerWeek: PropTypes.number,
    holidayAllowanceIncluded: PropTypes.bool,
    older: PropTypes.bool,
    ruling30Enabled: PropTypes.bool,
    ruling30Category: PropTypes.string,
    socialSecurity: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  year: PropTypes.number.isRequired,
  onYearChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
}

export default Box1InputForm
