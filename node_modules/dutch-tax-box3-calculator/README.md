# Dutch Tax Box 3 Calculator

A JavaScript/TypeScript library for calculating Dutch income tax Box 3 (wealth tax) based on savings and investments.

## Installation

```bash
npm install dutch-tax-box3-calculator
```

## Usage

### Basic Example

```javascript
import { calculateBox3Tax, getDefaultsForYear } from 'dutch-tax-box3-calculator';

// Calculate tax using 2024 defaults
const result = calculateBox3Tax(
  {
    bankBalance: 50000,
    investmentAssets: 30000,
    debts: 10000,
    hasTaxPartner: false
  },
  getDefaultsForYear(2024)
);

console.log(result);
// {
//   taxableBase: 16300,
//   estimatedTax: 1065.60,
//   breakdown: [...]
// }
```

### Using Current Year Defaults

```javascript
import { calculateBox3Tax, BOX3_DEFAULTS } from 'dutch-tax-box3-calculator';

const result = calculateBox3Tax(
  {
    bankBalance: 100000,
    investmentAssets: 0,
    debts: 0,
    hasTaxPartner: true
  },
  BOX3_DEFAULTS  // Uses 2025 defaults
);
```

### Custom Configuration

```javascript
import { calculateBox3Tax } from 'dutch-tax-box3-calculator';

const result = calculateBox3Tax(
  {
    bankBalance: 50000,
    investmentAssets: 30000,
    debts: 10000,
    hasTaxPartner: false
  },
  {
    thresholds: {
      taxFreeAssetsPerIndividual: 57000,
      debtsThresholdPerIndividual: 3700
    },
    taxRate: 0.36,
    assumedReturnRates: {
      bankBalance: 0.0092,
      investmentAssets: 0.0592,
      debts: 0.0292
    }
  }
);

console.log(result);
// {
//   taxableBase: 23000,
//   estimatedTax: 827.52,
//   breakdown: [...]
// }
```

### Working with Multiple Years

```javascript
import {
  calculateBox3Tax,
  AVAILABLE_YEARS,
  getDefaultsForYear
} from 'dutch-tax-box3-calculator';

// Get all available years
console.log(AVAILABLE_YEARS); // [2025, 2024, 2023]

// Calculate for each year
const inputs = {
  bankBalance: 75000,
  investmentAssets: 25000,
  debts: 5000,
  hasTaxPartner: false
};

AVAILABLE_YEARS.forEach(year => {
  const result = calculateBox3Tax(inputs, getDefaultsForYear(year));
  console.log(`${year}: €${result.estimatedTax.toFixed(2)}`);
});
```

## API

### `calculateBox3Tax(inputs, defaults)`

Calculates Dutch Box 3 tax based on user inputs and configuration defaults.

#### Parameters

- **inputs** (`Box3Input`): User's financial data
  - `bankBalance?` (number): Bank balance in euros
  - `investmentAssets?` (number): Investment assets in euros
  - `debts?` (number): Debts in euros
  - `hasTaxPartner?` (boolean): Whether the user has a tax partner

- **defaults** (`Box3Defaults`): Configuration values
  - `thresholds?`: Threshold values
    - `taxFreeAssetsPerIndividual?` (number): Tax-free assets per individual
    - `debtsThresholdPerIndividual?` (number): Debts threshold per individual
  - `taxRate?` (number): Tax rate applied to income
  - `assumedReturnRates?`: Return rates for different asset types
    - `bankBalance?` (number): Return rate for bank balance
    - `investmentAssets?` (number): Return rate for investments
    - `debts?` (number): Return rate for debts

#### Returns

- **Box3Result**: Calculation result
  - `taxableBase` (number): Basis for savings & investments
  - `estimatedTax` (number): Estimated Box 3 tax amount
  - `breakdown` (array): Detailed breakdown of calculation steps

### Constants

- **BOX3_DEFAULTS**: Current year (2025) defaults
- **BOX3_DEFAULTS_BY_YEAR**: Object containing defaults for years 2023, 2024, and 2025
- **AVAILABLE_YEARS**: Array of available years `[2025, 2024, 2023]`
- **DEFAULT_YEAR**: Current default year (2025)

### Helper Functions

- **getDefaultsForYear(year)**: Returns defaults for a specific year, falls back to current year if not found

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Maintainer Release Checklist

1. Ensure code quality checks pass: `npm run lint`, `npm run test`, and `npm run type-check`.
2. Build fresh artifacts: `npm run build` (clears `dist` first).
3. Inspect the publish payload: `npm pack` (tarball should contain only `dist`, `README.md`, and `LICENSE`).
4. Publish to npm (maintainers only): `npm publish --access public`.
5. Tag the release in git after publish.

## License

MIT - See [LICENSE](./LICENSE) for details.
