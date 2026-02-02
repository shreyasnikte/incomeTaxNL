import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import PropTypes from 'prop-types';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import './CalculatorToggleSwitch.css';

function CalculatorToggleSwitch({ value, onChange }) {
  const { t } = useLanguage();
  return (
    <div className="calculator-toggle-switch">
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={onChange}
        aria-label={t('calculator.boxToggleLabel')}
        size="small"
      >
        <ToggleButton value="box1" aria-label="Box 1">
          {t('calculator.box1')}
        </ToggleButton>
        <ToggleButton value="box3" aria-label="Box 3">
          {t('calculator.box3')}
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
