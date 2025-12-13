
# Dutch Tax Calculator (Frontend)

TaxNL is a privacy-first web app for Dutch tax calculations. It features two separate tools:

- **Salary Calculator (Box 1):** Estimate your net salary, taxes, and deductions for income from work.
- **Capital Gains Calculator (Box 3):** Calculate your tax on savings and investments, with configurable rates and thresholds.

**Privacy:** All calculations run locally in your browser. Your financial data is never sent, stored, or collected.

## Run Locally
- `npm install`
- `npm run dev`
- Open the local URL printed by Vite (e.g., `http://localhost:5173`)

## Test
- `npm run test` to run unit tests.

## Key Paths
- `src/features/tax-calculator/components/Box3InputForm.jsx` — Box 3 input modal and tax partner toggle
- `src/features/tax-calculator/components/Box1InputForm.jsx` — Box 1 salary input form
- `src/features/tax-calculator/components/Box3ResultPanel.jsx` — Box 3 results and breakdown
- `src/features/tax-calculator/components/Box1ResultPanel.jsx` — Box 1 results and breakdown
- `src/features/tax-calculator/components/ConfigurationMenu.jsx` — Box 3 configuration dialog
- `src/features/tax-calculator/hooks/useBox3Calculator.js` — Box 3 calculator logic
- `src/features/tax-calculator/hooks/useBox1Calculator.js` — Box 1 calculator logic
- `src/features/tax-calculator/utils/box3.js` — Box 3 computation
- `src/features/tax-calculator/constants/box3Defaults.js` — Box 3 default constants

## Notes
- Dev server port may auto-increment if busy (5173 → 5174 → 5175).
- No data is sent to a server; everything runs in-browser.
