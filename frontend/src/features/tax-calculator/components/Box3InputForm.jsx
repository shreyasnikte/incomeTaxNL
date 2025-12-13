import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

const getFieldConfig = (t) => [
  {
    name: 'bankAccounts',
    label: t('box3.form.fields.bankAccounts.label'),
    type: 'multiCurrency',
    detailLabel: t('box3.form.fields.bankAccounts.detail'),
    detailLabelPlural: t('box3.form.fields.bankAccounts.detailPlural'),
    emptyLabel: t('box3.form.fields.bankAccounts.empty'),
    entryNameLabel: t('box3.form.fields.bankAccounts.nameLabel'),
    entryNamePlaceholder: t('box3.form.fields.bankAccounts.placeholder'),
    description: t('box3.form.fields.bankAccounts.description'),
  },
  {
    name: 'investmentAccounts',
    label: t('box3.form.fields.investmentAccounts.label'),
    type: 'multiCurrency',
    detailLabel: t('box3.form.fields.investmentAccounts.detail'),
    detailLabelPlural: t('box3.form.fields.investmentAccounts.detailPlural'),
    emptyLabel: t('box3.form.fields.investmentAccounts.empty'),
    entryNameLabel: t('box3.form.fields.investmentAccounts.nameLabel'),
    entryNamePlaceholder: t('box3.form.fields.investmentAccounts.placeholder'),
    description: t('box3.form.fields.investmentAccounts.description'),
  },
  {
    name: 'debts',
    label: t('box3.form.fields.debts.label'),
    type: 'multiCurrency',
    detailLabel: t('box3.form.fields.debts.detail'),
    detailLabelPlural: t('box3.form.fields.debts.detailPlural'),
    emptyLabel: t('box3.form.fields.debts.empty'),
    entryNameLabel: t('box3.form.fields.debts.nameLabel'),
    entryNamePlaceholder: t('box3.form.fields.debts.placeholder'),
    description: t('box3.form.fields.debts.description'),
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
  const { t } = useTranslation()
  const [modalState, setModalState] = useState(null)
  const [expandedPanel, setExpandedPanel] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [amountError, setAmountError] = useState('')
  const [showCloseWarning, setShowCloseWarning] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const isCompactViewport = useMediaQuery('(max-width: 640px)')

  const fieldConfig = useMemo(() => getFieldConfig(t), [t])

  const fieldLookup = useMemo(() => {
    const map = new Map()
    fieldConfig.forEach((field) => map.set(field.name, field))
    return map
  }, [fieldConfig])

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
    const fallbackLabel = field.detailLabel ? t('box3.form.actions.unnamedWithLabel', { label: field.detailLabel }) : t('box3.form.actions.unnamed')
    if (list.length === 0) {
      const emptyMessage = field.emptyLabel || t('box3.form.fields.defaultEmpty')
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
          setAmountError(t('box3.form.modal.errors.invalidNumber'))
        } else if (numericValue < 0) {
          setAmountError(t('box3.form.modal.errors.negative'))
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
          label={t('box1.form.yearLabel')}
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="tax-form__year-select"
          aria-label={t('box1.form.yearLabel')}
        >
          {AVAILABLE_YEARS.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <Stack spacing={0} component={Box} className="tax-form__fields">
        {fieldConfig.map((field) => {
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
                    {t('box3.form.actions.manage')}
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </Stack>

      <Box className="tax-form__partner-section">
        <Typography variant="body1" fontWeight="normal" color="text.primary">
          {t('box3.form.partner.label')}
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={values.hasTaxPartner ? 'yes' : 'no'}
          onChange={handlePartnerToggle}
          className="tax-form__partner-toggle"
          aria-label="Tax partner selection"
        >
          <ToggleButton value="yes" aria-label={t('box3.form.partner.yes')}>
            {t('box3.form.partner.yes')}
          </ToggleButton>
          <ToggleButton value="no" aria-label={t('box3.form.partner.no')}>
            {t('box3.form.partner.no')}
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
          aria-label={t('box3.form.reset.ariaLabel')}
        >
          {t('box3.form.reset.button')}
        </Button>
        {configMenu && <div className="tax-form__config-menu">{configMenu}</div>}
      </Box>

      <Box className="tax-form__helper-link">
        <JaaropgaveGuide />
      </Box>

      {/* Reset confirmation dialog */}
      <Dialog open={showResetConfirm} onClose={() => setShowResetConfirm(false)} maxWidth="xs">
        <DialogTitle>{t('box3.form.reset.dialog.title')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {t('box3.form.reset.dialog.content')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetConfirm(false)} color="inherit">
            {t('box3.form.reset.dialog.cancel')}
          </Button>
          <Button
            onClick={() => {
              onReset()
              setShowResetConfirm(false)
            }}
            variant="contained"
            color="error"
          >
            {t('box3.form.reset.dialog.confirm')}
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
                                aria-label={`${t('box3.form.modal.edit')} ${entry.name || activeField?.detailLabel || 'entry'}`}
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
                                : t('box3.form.actions.unnamedWithLabel', { label: activeField?.detailLabel })
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
                      {activeField?.emptyLabel || t('box3.form.fields.defaultEmpty')}
                    </Typography>
                  )}

                  <div className="tax-form__modal-add-section">
                    <Typography variant="subtitle2" className="tax-form__modal-add-title">
                      {editingIndex !== null ? t('box3.form.modal.edit') : t('box3.form.modal.add')}
                    </Typography>
                    <div className="tax-form__modal-add-row">
                      <TextField
                        variant="outlined"
                        size="small"
                        label={activeField?.entryNameLabel || t('box3.form.fields.defaultNameLabel')}
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
                        label={t('box3.form.modal.amount')}
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
                        {editingIndex !== null ? t('box3.form.modal.update') : t('box3.form.modal.addBtn')}
                      </Button>
                    </div>
                  </div>
                </Stack>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => closeDialog()} color="inherit">
                {t('box3.form.modal.cancel')}
              </Button>
              <Button onClick={handleConfirm} disabled={isConfirmDisabled()} variant="contained">
                {t('box3.form.modal.save')}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Unsaved changes warning dialog */}
          <Dialog open={showCloseWarning} onClose={() => setShowCloseWarning(false)} maxWidth="xs">
            <DialogTitle>{t('box3.form.modal.warning.title')}</DialogTitle>
            <DialogContent>
              <Typography variant="body2">
                {t('box3.form.modal.warning.content', { label: activeField?.detailLabel || 'entry' })}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowCloseWarning(false)} color="inherit">
                {t('box3.form.modal.warning.keep')}
              </Button>
              <Button onClick={forceCloseDialog} variant="contained" color="error">
                {t('box3.form.modal.warning.discard')}
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
