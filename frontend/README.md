Dutch Tax Frontend (React + Vite)

Run Locally
- `npm install`
- `npm run dev`
- Open the local URL printed by Vite (e.g., `http://localhost:5173`)

Key Paths
- `src/features/tax-calculator/components/TaxInputForm.jsx` — input modal and partner toggle
- `src/features/tax-calculator/components/TaxResultPanel.jsx` — results and breakdown
- `src/features/tax-calculator/components/ConfigurationMenu.jsx` — Box 3 configuration dialog
- `src/features/tax-calculator/hooks/useBox3Calculator.js` — calculator hook
- `src/features/tax-calculator/utils/box3.js` — Box 3 computation
- `src/features/tax-calculator/constants/box3Defaults.js` — default constants

Notes
- Dev server port may auto-increment if busy (5173 → 5174 → 5175).
- No data is sent to a server; everything runs in-browser.
