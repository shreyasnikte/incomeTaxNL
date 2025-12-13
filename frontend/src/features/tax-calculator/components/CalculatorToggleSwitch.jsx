import React from 'react';
import { useTranslation } from 'react-i18next';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import PropTypes from 'prop-types';
import './CalculatorToggleSwitch.css';

function CalculatorToggleSwitch({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="calculator-toggle-switch">
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={onChange}
        aria-label="Calculator type"
        size="small"
      >
        <ToggleButton value="box1" aria-label={t('calculator.toggle.box1')}>
          {t('calculator.toggle.box1')}
        </ToggleButton>
        <ToggleButton value="box3" aria-label={t('calculator.toggle.box3')}>
          {t('calculator.toggle.box3')}
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

CalculatorToggleSwitch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CalculatorToggleSwitch;
