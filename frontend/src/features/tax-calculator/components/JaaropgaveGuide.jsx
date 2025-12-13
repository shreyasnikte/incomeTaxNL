import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  Divider,
} from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import './JaaropgaveGuide.css'

function JaaropgaveGuide() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState('panel-bank')

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleAccordionChange = (panel) => (_event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  // Load guide data from translations
  // We use returnObjects: true to get the nested structure back
  const bankGuide = t('guide.sections.bank', { returnObjects: true })
  const investmentGuide = t('guide.sections.investment', { returnObjects: true })
  const generalGuide = t('guide.sections.general', { returnObjects: true })

  // Construct guide objects merging icons with translated data
  // Check if data is loaded correctly (not a string key) to prevent crashes if translations missing
  const guides = [
    { 
      id: 'panel-bank',
      icon: <AccountBalanceIcon />, 
      ...bankGuide
    },
    { 
      id: 'panel-investment',
      icon: <TrendingUpIcon />, 
      ...investmentGuide
    },
    { 
      id: 'panel-general',
      icon: <InfoOutlinedIcon />, 
      ...generalGuide
    },
  ]

  const renderGuideSection = (guide) => (
    <Accordion
      key={guide.id}
      expanded={expanded === guide.id}
      onChange={handleAccordionChange(guide.id)}
      className="jaaropgave-guide__accordion"
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <span className="jaaropgave-guide__icon">{guide.icon}</span>
          <Typography variant="subtitle1" fontWeight={600}>
            {guide.title}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {guide.description}
        </Typography>
        <Stack spacing={2}>
          {guide.content && guide.content.map((section, idx) => (
            <Box key={idx}>
              <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mb: 0.5 }}>
                {section.heading}
              </Typography>
              <ul className="jaaropgave-guide__list">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Typography variant="body2">{item}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )

  return (
    <>
      <Button
        variant="text"
        size="small"
        onClick={handleOpen}
        className="jaaropgave-guide__trigger"
      >
        {t('guide.trigger')}
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className="jaaropgave-guide__title">
          <Stack direction="row" spacing={1} alignItems="center">
            <HelpOutlineIcon color="primary" />
            <span>{t('guide.title')}</span>
          </Stack>
          <Chip label="Box 3" size="small" color="primary" variant="outlined" />
        </DialogTitle>
        <DialogContent dividers className="jaaropgave-guide__content">
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('guide.subtitle')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            {guides.map(guide => renderGuideSection(guide))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            {t('guide.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default JaaropgaveGuide
