import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import PropTypes from 'prop-types';
import './CalculatorToggleSwitch.css';

function CalculatorToggleSwitch({ value, onChange }) {
  return (
    <div className="calculator-toggle-switch">
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={onChange}
        aria-label="Calculator type"
        size="small"
      >
        <ToggleButton value="box1" aria-label="Box 1">
          Salary (Box 1)
        </ToggleButton>
        <ToggleButton value="box3" aria-label="Box 3">
          Capital Gains (Box 3)
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
