import { useState, useMemo } from 'react'
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

const getBankGuide = (t) => ({
  title: t('guide.bank.title'),
  icon: <AccountBalanceIcon />,
  description: t('guide.bank.description'),
  sections: [
    {
      heading: t('guide.labels.whatToLookFor'),
      items: [
        t('guide.bank.items.look1'),
        t('guide.bank.items.look2'),
        t('guide.bank.items.look3'),
      ],
    },
    {
      heading: t('guide.labels.commonBanks'),
      items: [
        t('guide.bank.items.bank1'),
        t('guide.bank.items.bank2'),
        t('guide.bank.items.bank3'),
        t('guide.bank.items.bank4'),
        t('guide.bank.items.bank5'),
      ],
    },
    {
      heading: t('guide.labels.tips'),
      items: [
        t('guide.bank.items.tip1'),
        t('guide.bank.items.tip2'),
        t('guide.bank.items.tip3'),
      ],
    },
  ],
})

const getInvestmentGuide = (t) => ({
  title: t('guide.investments.title'),
  icon: <TrendingUpIcon />,
  description: t('guide.investments.description'),
  sections: [
    {
      heading: t('guide.labels.whatToLookFor'),
      items: [
        t('guide.investments.items.look1'),
        t('guide.investments.items.look2'),
        t('guide.investments.items.look3'),
      ],
    },
    {
      heading: t('guide.labels.commonPlatforms'),
      items: [
        t('guide.investments.items.plat1'),
        t('guide.investments.items.plat2'),
        t('guide.investments.items.plat3'),
        t('guide.investments.items.plat4'),
        t('guide.investments.items.plat5'),
        t('guide.investments.items.plat6'),
        t('guide.investments.items.plat7'),
      ],
    },
    {
      heading: t('guide.labels.tips'),
      items: [
        t('guide.investments.items.tip1'),
        t('guide.investments.items.tip2'),
        t('guide.investments.items.tip3'),
        t('guide.investments.items.tip4'),
      ],
    },
  ],
})

const getGeneralInfo = (t) => ({
  title: t('guide.general.title'),
  icon: <InfoOutlinedIcon />,
  description: t('guide.general.description'),
  sections: [
    {
      heading: t('guide.general.dateTitle'),
      items: [
        t('guide.general.items.date1'),
        t('guide.general.items.date2'),
        t('guide.general.items.date3'),
      ],
    },
    {
      heading: t('guide.general.assetsTitle'),
      items: [
        t('guide.general.items.asset1'),
        t('guide.general.items.asset2'),
        t('guide.general.items.asset3'),
        t('guide.general.items.asset4'),
        t('guide.general.items.asset5'),
      ],
    },
    {
      heading: t('guide.general.debtsTitle'),
      items: [
        t('guide.general.items.debt1'),
        t('guide.general.items.debt2'),
        t('guide.general.items.debt3'),
        t('guide.general.items.debt4'),
        t('guide.general.items.debt5'),
      ],
    },
  ],
})

function JaaropgaveGuide() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const bankGuide = useMemo(() => getBankGuide(t), [t])
  const investmentGuide = useMemo(() => getInvestmentGuide(t), [t])
  const generalInfo = useMemo(() => getGeneralInfo(t), [t])
  const [expanded, setExpanded] = useState('panel-bank')

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleAccordionChange = (panel) => (_event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const renderGuideSection = (guide, panelId) => (
    <Accordion
      key={panelId}
      expanded={expanded === panelId}
      onChange={handleAccordionChange(panelId)}
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
          {guide.sections.map((section, idx) => (
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
            {t('guide.intro')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            {renderGuideSection(bankGuide, 'panel-bank')}
            {renderGuideSection(investmentGuide, 'panel-investment')}
            {renderGuideSection(generalInfo, 'panel-general')}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            {t('guide.gotIt')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default JaaropgaveGuide
