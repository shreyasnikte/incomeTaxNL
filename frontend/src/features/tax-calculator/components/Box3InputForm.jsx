import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { monetaryEntryPropType } from '../../../utils/propTypes.js'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  useMediaQuery,
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { AVAILABLE_YEARS } from 'dutch-tax-box3-calculator'
import { formatEuro } from '../../../utils/formatters.js'
import JaaropgaveGuide from './JaaropgaveGuide.jsx'
import './Box3InputForm.css'

const FIELD_CONFIG = [
  {
    name: 'bankAccounts',
    label: 'Bank accounts',
    type: 'multiCurrency',
    detailLabel: 'account',
    detailLabelPlural: 'accounts',
    emptyLabel: 'No accounts added yet',
    entryNameLabel: 'Account name',
    entryNamePlaceholder: 'e.g. ING savings',
    description: 'Add the balances of your Dutch checking and savings accounts on 1 January.',
  },
  {
    name: 'investmentAccounts',
    label: 'Investment accounts',
    type: 'multiCurrency',
    detailLabel: 'account',
    detailLabelPlural: 'accounts',
    emptyLabel: 'No accounts added yet',
    entryNameLabel: 'Account name',
    entryNamePlaceholder: 'e.g. DEGIRO brokerage',
    description: 'Include the market value of your investment or brokerage portfolios on 1 January.',
  },
  {
    name: 'debts',
    label: 'Debts',
    type: 'multiCurrency',
    detailLabel: 'debt',
    detailLabelPlural: 'debts',
    emptyLabel: 'No debts added yet',
    entryNameLabel: 'Debt name',
    entryNamePlaceholder: 'e.g. Mortgage balance',
    description: 'List deductible debts, such as loans outstanding on 1 January.',
  },
]

const normalizeEntryList = (rawList) => {
  const source = Array.isArray(rawList) ? rawList : []
  return source
    .map((entry) => {
      if (entry && typeof entry === 'object') {
        const amount = Number(entry.amount)
        const isAmountValid = Number.isFinite(amount) && amount >= 0
        return {
          name: typeof entry.name === 'string' ? entry.name.trim() : '',
          amount: isAmountValid ? amount : 0,
          valid: isAmountValid,
        }
      }
      const amount = Number(entry)
      const isAmountValid = Number.isFinite(amount) && amount >= 0
      return {
        name: '',
        amount: isAmountValid ? amount : 0,
        valid: isAmountValid,
      }
    })
    .filter((entry) => entry.valid)
    .map(({ name, amount }) => ({ name, amount }))
}


function Box3InputForm({ values, onChange, year, onYearChange, onReset, configMenu }) {
  const [modalState, setModalState] = useState(null)
  const [expandedPanel, setExpandedPanel] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [amountError, setAmountError] = useState('')
  const [showCloseWarning, setShowCloseWarning] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const isCompactViewport = useMediaQuery('(max-width: 640px)')

  const fieldLookup = useMemo(() => {
    const map = new Map()
    FIELD_CONFIG.forEach((field) => map.set(field.name, field))
    return map
  }, [])

  const {
    bankAccounts = [],
    investmentAccounts = [],
    debts = [],
  } = values

  const normalizedEntryMap = useMemo(
    () => ({
      bankAccounts: normalizeEntryList(bankAccounts),
      investmentAccounts: normalizeEntryList(investmentAccounts),
      debts: normalizeEntryList(debts),
    }),
    [bankAccounts, investmentAccounts, debts],
  )

  const getNormalizedEntries = (fieldName) => normalizedEntryMap[fieldName] ?? []

  const getPrimaryValueParts = (fieldName) => {
    const field = fieldLookup.get(fieldName)
    if (!field) {
      return { amount: '', detail: '' }
    }

    if (field.type === 'multiCurrency') {
      const list = getNormalizedEntries(fieldName)
      const total = list.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0)
      const singular = field.detailLabel || 'entry'
      const plural = field.detailLabelPlural || `${singular}s`
      const label = list.length === 1 ? singular : plural
      return {
        amount: formatEuro(total),
        detail: `${list.length} ${label}`,
      }
    }

    const numericValue = Number(values[fieldName]) || 0
    return {
      amount: formatEuro(numericValue),
      detail: '',
    }
  }

  const renderSecondaryValue = (fieldName) => {
    const field = fieldLookup.get(fieldName)
    if (!field || field.type !== 'multiCurrency') {
      return null
    }

    const list = getNormalizedEntries(fieldName)
    const fallbackLabel = field.detailLabel ? `Unnamed ${field.detailLabel}` : 'Unnamed entry'
    if (list.length === 0) {
      const emptyMessage = field.emptyLabel || 'No amounts added yet'
      return <span className="tax-form__summary-empty">{emptyMessage}</span>
    }

    return (
      <ul className="tax-form__summary-list">
        {list.map((entry, index) => (
          <li key={`${fieldName}-${index}`}>
            {entry.name ? `${entry.name}: ` : `${fallbackLabel}: `}
            {formatEuro(Number(entry.amount) || 0)}
          </li>
        ))}
      </ul>
    )
  }

  const openDialog = (fieldName) => {
    const field = fieldLookup.get(fieldName)
    if (!field) return

    if (field.type === 'multiCurrency') {
      const entries = getNormalizedEntries(fieldName)
      setModalState({
        fieldName,
        type: 'multiCurrency',
        entries,
        newEntry: { name: '', amount: '' },
      })
      setEditingIndex(null)
      setAmountError('')
      setShowCloseWarning(false)
    }
  }

  const hasUnsavedChanges = () => {
    if (!modalState || modalState.type !== 'multiCurrency') return false
    const nameValue = String(modalState.newEntry?.name ?? '').trim()
    const amountValue = String(modalState.newEntry?.amount ?? '').trim()
    return nameValue !== '' || amountValue !== ''
  }

  const closeDialog = (force = false) => {
    if (!force && hasUnsavedChanges()) {
      setShowCloseWarning(true)
      return
    }
    setModalState(null)
    setEditingIndex(null)
    setAmountError('')
    setShowCloseWarning(false)
  }

  const forceCloseDialog = () => {
    closeDialog(true)
  }

  const handleNewEntryChange = (key, nextValue) => {
    if (key === 'amount') {
      const trimmed = String(nextValue).trim()
      if (trimmed === '') {
        setAmountError('')
      } else {
        const numericValue = Number(trimmed)
        if (Number.isNaN(numericValue) || !Number.isFinite(numericValue)) {
          setAmountError('Please enter a valid number')
        } else if (numericValue < 0) {
          setAmountError('Amount cannot be negative')
        } else {
          setAmountError('')
        }
      }
    }
    setModalState((current) =>
      current && current.type === 'multiCurrency'
        ? { ...current, newEntry: { ...current.newEntry, [key]: nextValue } }
        : current,
    )
  }

  const handleEditEntry = (index) => {
    if (!modalState || modalState.type !== 'multiCurrency') return
    const entry = modalState.entries[index]
    if (!entry) return
    setEditingIndex(index)
    setModalState((current) => ({
      ...current,
      newEntry: { name: entry.name || '', amount: String(entry.amount) },
    }))
    setAmountError('')
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setModalState((current) =>
      current ? { ...current, newEntry: { name: '', amount: '' } } : current,
    )
    setAmountError('')
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    if (isAddDisabled()) return

    if (typeof event.currentTarget?.blur === 'function') {
      event.currentTarget.blur()
    } else if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    handleAddEntry()
  }

  const handleAddEntry = () => {
    setModalState((current) => {
      if (!current || current.type !== 'multiCurrency') return current
      const trimmedAmount = String(current.newEntry?.amount ?? '').trim()
      if (trimmedAmount === '') return current
      const numericValue = Number(trimmedAmount)
      if (!Number.isFinite(numericValue) || Number.isNaN(numericValue) || numericValue < 0) {
        return current
      }
      const nameValue = String(current.newEntry?.name ?? '').trim()
      
      if (editingIndex !== null) {
        // Update existing entry
        const updatedEntries = [...current.entries]
        updatedEntries[editingIndex] = { name: nameValue, amount: numericValue }
        setEditingIndex(null)
        return {
          ...current,
          entries: updatedEntries,
          newEntry: { name: '', amount: '' },
        }
      }
      
      return {
        ...current,
        entries: [...current.entries, { name: nameValue, amount: numericValue }],
        newEntry: { name: '', amount: '' },
      }
    })
    if (editingIndex !== null) {
      setEditingIndex(null)
    }
  }

  const handleRemoveEntry = (indexToRemove) => {
    setModalState((current) => {
      if (!current || current.type !== 'multiCurrency') return current
      const updated = current.entries.filter((_, index) => index !== indexToRemove)
      return { ...current, entries: updated }
    })
  }

  const isAddDisabled = () => {
    if (!modalState || modalState.type !== 'multiCurrency') {
      return true
    }
    const trimmed = String(modalState.newEntry?.amount ?? '').trim()
    if (trimmed === '') return true
    const numericValue = Number(trimmed)
    return Number.isNaN(numericValue) || !Number.isFinite(numericValue) || numericValue < 0
  }

  const handleConfirm = () => {
    if (!modalState) return
    const field = fieldLookup.get(modalState.fieldName)
    if (!field) {
      closeDialog()
      return
    }

    if (modalState.type !== 'multiCurrency') {
      closeDialog()
      return
    }

    let entries = modalState.entries
    const trimmedAmount = String(modalState.newEntry?.amount ?? '').trim()
    if (trimmedAmount !== '') {
      const numericValue = Number(trimmedAmount)
      if (!Number.isNaN(numericValue) && Number.isFinite(numericValue) && numericValue >= 0) {
        const nameValue = String(modalState.newEntry?.name ?? '').trim()
        entries = [...entries, { name: nameValue, amount: numericValue }]
      }
    }
    const sanitizedEntries = entries
      .map((entry) => {
        const amount = Number(entry?.amount)
        const name = typeof entry?.name === 'string' ? entry.name.trim() : ''
        return {
          name,
          amount,
        }
      })
      .filter((entry) => Number.isFinite(entry.amount) && entry.amount >= 0)
    onChange(field.name, sanitizedEntries)
    closeDialog()
  }

  const isConfirmDisabled = () => {
    if (!modalState) return true
    return modalState.type !== 'multiCurrency'
  }

  const handlePartnerToggle = (_event, value) => {
    if (value === null) return
    onChange('hasTaxPartner', value === 'yes')
  }

  const activeField = modalState ? fieldLookup.get(modalState.fieldName) : null

  const getModalTotals = () => {
    if (!modalState || modalState.type !== 'multiCurrency') {
      return { count: 0, total: 0 }
    }
    const count = modalState.entries.length
    const total = modalState.entries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0)
    return { count, total }
  }

  const modalTotals = getModalTotals()
  const entryDialogPaperClass = isCompactViewport
    ? 'tax-form__entry-dialog-paper tax-form__entry-dialog-paper--mobile'
    : 'tax-form__entry-dialog-paper'

  return (
    <form className="tax-form" onSubmit={(event) => event.preventDefault()} noValidate>
      {/* Header removed as requested */}

      <div className="tax-form__year-row">
        <TextField
          select
          size="small"
          label="Tax year"
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="tax-form__year-select"
          aria-label="Tax year"
        >
          {AVAILABLE_YEARS.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <Stack spacing={0} component={Box} className="tax-form__fields">
        {FIELD_CONFIG.map((field) => {
          const { amount } = getPrimaryValueParts(field.name)
          const secondaryContent = renderSecondaryValue(field.name)
          const isExpanded = expandedPanel === field.name
          const panelId = `panel-${field.name}`

          return (
            <Accordion
              key={field.name}
              expanded={isExpanded}
              onChange={(_event, nextExpanded) =>
                setExpandedPanel(nextExpanded ? field.name : null)
              }
              disableGutters
              className="tax-form__accordion"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${panelId}-content`}
                id={`${panelId}-header`}
                className="tax-form__accordion-summary"
              >
                <div className="tax-form__summary-content">
                  <div className="tax-form__summary-info">
                    <div className="tax-form__summary-heading">
                      <Typography variant="subtitle1" fontWeight="normal" color="text.primary">
                        {field.label}
                      </Typography>
                    </div>
                    <div className="tax-form__summary-values">
                      <span className="tax-form__summary-amount">{amount}</span>
                      {/* Account count removed as requested */}
                    </div>
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails className="tax-form__accordion-details" id={`${panelId}-content`}>
                {/* Description removed as requested */}
                {secondaryContent && (
                  <div className="tax-form__section-summary">{secondaryContent}</div>
                )}
                <div className="tax-form__section-actions">
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleIcon />}
                    onClick={() => openDialog(field.name)}
                  >
                    Manage entries
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </Stack>

      <Box className="tax-form__partner-section">
        <Typography variant="body1" fontWeight="normal" color="text.primary">
          I have a tax partner
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={values.hasTaxPartner ? 'yes' : 'no'}
          onChange={handlePartnerToggle}
          className="tax-form__partner-toggle"
          aria-label="Tax partner selection"
        >
          <ToggleButton value="yes" aria-label="Yes">
            Yes
          </ToggleButton>
          <ToggleButton value="no" aria-label="No">
            No
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box className="tax-form__actions-grid" display="flex" gap={2} alignItems="center" justifyContent="flex-end" mt={2}>
        <Button
          size="small"
          color="error"
          onClick={() => setShowResetConfirm(true)}
          className="tax-form__reset-button"
          startIcon={<RestartAltIcon fontSize="small" />}
          aria-label="Reset all values"
        >
          Reset
        </Button>
        {configMenu && <div className="tax-form__config-menu">{configMenu}</div>}
      </Box>

      <Box className="tax-form__helper-link">
        <JaaropgaveGuide />
      </Box>

      {/* Reset confirmation dialog */}
      <Dialog open={showResetConfirm} onClose={() => setShowResetConfirm(false)} maxWidth="xs">
        <DialogTitle>Reset all values?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This will clear all your entered data including bank accounts, investments, and debts. This action cannot be undone.
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

      {modalState && (
        <>
          <Dialog
            open
            onClose={() => closeDialog()}
            fullWidth
            maxWidth="sm"
            fullScreen={isCompactViewport}
            scroll="paper"
            PaperProps={{ className: entryDialogPaperClass }}
          >
            <DialogTitle className="tax-form__modal-title">
              <span>{activeField?.label}</span>
              <div className="tax-form__modal-stats">
                <span className="tax-form__modal-count">
                  {modalTotals.count} {modalTotals.count === 1 ? activeField?.detailLabel : activeField?.detailLabelPlural}
                </span>
                <span className="tax-form__modal-total">
                  {formatEuro(modalTotals.total)}
                </span>
              </div>
            </DialogTitle>
            <DialogContent dividers>
              {modalState.type === 'multiCurrency' && (
                <Stack spacing={2} className="tax-form__modal-group">
                  {modalState.entries.length > 0 ? (
                    <List className="tax-form__modal-list">
                      {modalState.entries.map((entry, index) => (
                        <ListItem
                          key={`entry-${index}`}
                          alignItems="flex-start"
                          className={editingIndex === index ? 'tax-form__modal-list-item--editing' : ''}
                          secondaryAction={
                            <Stack direction="row" spacing={0.5}>
                              <IconButton
                                edge="end"
                                onClick={() => handleEditEntry(index)}
                                aria-label={`Edit ${entry.name || activeField?.detailLabel || 'entry'}`}
                                disabled={editingIndex !== null}
                              >
                                <EditIcon color="primary" />
                              </IconButton>
                              <IconButton
                                edge="end"
                                onClick={() => handleRemoveEntry(index)}
                                aria-label={`Remove ${entry.name || activeField?.detailLabel || 'entry'}`}
                                disabled={editingIndex !== null}
                              >
                                <DeleteOutlineIcon color="error" />
                              </IconButton>
                            </Stack>
                          }
                        >
                          <ListItemText
                            primary={
                              entry.name && entry.name.trim() !== ''
                                ? entry.name
                                : `Unnamed ${activeField?.detailLabel ?? 'entry'}`
                            }
                            secondary={`Amount: ${formatEuro(Number(entry.amount) || 0)}`}
                            primaryTypographyProps={{
                              variant: 'body1',
                              fontWeight: entry.name ? 600 : 500,
                            }}
                            secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography className="tax-form__modal-empty" align="center">
                      {activeField?.emptyLabel || 'No amounts added yet.'}
                    </Typography>
                  )}

                  <div className="tax-form__modal-add-section">
                    <Typography variant="subtitle2" className="tax-form__modal-add-title">
                      {editingIndex !== null ? 'Edit entry' : 'Add new entry'}
                    </Typography>
                    <div className="tax-form__modal-add-row">
                      <TextField
                        variant="outlined"
                        size="small"
                        label={activeField?.entryNameLabel || 'Account name'}
                        placeholder={activeField?.entryNamePlaceholder || 'e.g. ING savings'}
                        value={modalState.newEntry?.name ?? ''}
                        onChange={(event) => handleNewEntryChange('name', event.target.value)}
                        onKeyDown={handleKeyDown}
                        className="tax-form__modal-field tax-form__modal-field--name"
                        autoFocus
                      />
                      <TextField
                        variant="outlined"
                        size="small"
                        type="number"
                        inputProps={{ inputMode: 'decimal', step: '0.01', min: 0 }}
                        value={modalState.newEntry?.amount ?? ''}
                        onChange={(event) => handleNewEntryChange('amount', event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="0.00"
                        label="Amount (EUR)"
                        className="tax-form__modal-field tax-form__modal-field--amount"
                        error={!!amountError}
                        helperText={amountError}
                      />
                      {editingIndex !== null && (
                        <Button
                          onClick={handleCancelEdit}
                          variant="outlined"
                          color="inherit"
                          size="small"
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        onClick={handleAddEntry}
                        disabled={isAddDisabled()}
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        {editingIndex !== null ? 'Update' : 'Add'}
                      </Button>
                    </div>
                  </div>
                </Stack>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => closeDialog()} color="inherit">
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={isConfirmDisabled()} variant="contained">
                Save changes
              </Button>
            </DialogActions>
          </Dialog>

          {/* Unsaved changes warning dialog */}
          <Dialog open={showCloseWarning} onClose={() => setShowCloseWarning(false)} maxWidth="xs">
            <DialogTitle>Discard unsaved entry?</DialogTitle>
            <DialogContent>
              <Typography variant="body2">
                You have started entering a new {activeField?.detailLabel || 'entry'} but haven't added it yet. Are you sure you want to discard it?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowCloseWarning(false)} color="inherit">
                Keep editing
              </Button>
              <Button onClick={forceCloseDialog} variant="contained" color="error">
                Discard
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </form>
  )
}

Box3InputForm.propTypes = {
  values: PropTypes.shape({
    bankAccounts: PropTypes.arrayOf(monetaryEntryPropType).isRequired,
    investmentAccounts: PropTypes.arrayOf(monetaryEntryPropType).isRequired,
    debts: PropTypes.arrayOf(monetaryEntryPropType).isRequired,
    hasTaxPartner: PropTypes.bool.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  year: PropTypes.number.isRequired,
  onYearChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  configMenu: PropTypes.node,
}

export default Box3InputForm
