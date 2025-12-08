Dutch Tax (FOSS)

An open, privacy-first tool to estimate Dutch Box 3 tax (income from savings and investments). The app runs entirely in your browser — no data leaves your machine.

Features
- Transparent calculations based on configurable Box 3 defaults
- Clean input modal with inline validation and edit-in-place
- Tax partner toggle for thresholds and allowances
- Live summary with breakdown of returns, costs, and estimated tax

Quick Start
- Requirements: Node.js 18+ and npm
- Dev run:
	1. `cd frontend`
	2. `npm install`
	3. `npm run dev`
	4. Open the local URL printed by Vite (e.g., `http://localhost:5173`)

Usage
- Financial inputs: Add bank accounts, investment accounts, and debts using the “Manage entries” modal.
- Edit entries: Use the pencil icon; press Enter to add/update; delete with the bin icon.
- Tax partner: Toggle “I have a tax partner” to update thresholds.
- Results: The right panel shows taxable base and estimated Box 3 tax, with a detailed breakdown.

Configuration
- Open the settings (gear icon) in the header.
- Update Box 3 defaults:
	- Year
	- Thresholds: `taxFreeAssetsPerIndividual`, `debtsThresholdPerIndividual`
	- `taxRate` (%)
	- Assumed return rates (%) for `bankBalance`, `investmentAssets`, `debts`
- Reset to defaults via the restore icon.
- Source of defaults: `frontend/src/features/tax-calculator/constants/box3Defaults.js`

Project Structure
- Frontend app in `frontend/` (React + Vite)
- Key paths:
	- Inputs: `frontend/src/features/tax-calculator/components/TaxInputForm.jsx`
	- Results: `frontend/src/features/tax-calculator/components/TaxResultPanel.jsx`
	- Config menu: `frontend/src/features/tax-calculator/components/ConfigurationMenu.jsx`
	- Calculator hook: `frontend/src/features/tax-calculator/hooks/useBox3Calculator.js`
	- Box 3 logic: `frontend/src/features/tax-calculator/utils/box3.js`
	- Defaults: `frontend/src/features/tax-calculator/constants/box3Defaults.js`

Accessibility
- Buttons have descriptive `aria-label`s; keyboard support for Enter to add/update.
- Dialogs announce counts and totals; focus is managed to reduce tab friction.

Privacy & Disclaimer
- No tracking, no uploads — all computation happens locally.
- This tool is for guidance and education only. For personal tax decisions, consult the Belastingdienst or a qualified advisor.