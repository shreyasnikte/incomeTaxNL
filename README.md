
# TaxNL


**Your financial data is your business.** TaxNL is a privacy-focused free and open source tool to estimate Dutch Box 1 and Box 3 taxes. Any data you enter is only stored locally in your browser. All calculations run 100% locally in your browser — your personal financial data is never sent, stored, or collected by this app for any reason.

**Why local-only?**
- No risk of leaks, hacks, or misuse: your sensitive information never leaves your device.
- No tracking, no uploads, no analytics: you stay in control of your data.
- Use TaxNL with confidence for salary and capital gains calculations, knowing your privacy is protected.

![TaxNL Screenshot](frontend/src/assets/screenshot.png)

![TaxNL Screenshot](frontend/src/assets/screenshot.png)

## Features
- Privacy-first: Your financial data never leaves your device
- Instantly calculate Dutch salary (Box 1) and capital gains tax (Box 3)
- Simple, clean input forms for salary, savings, investments, and debts
- Tax partner support for accurate thresholds and allowances
- Clear results panel with breakdowns and explanations

## Quick Start
- Requirements: Node.js 18+ and npm
- Dev run:
	1. `cd frontend`
	2. `npm install`
	3. `npm run dev`
	4. Open the local URL printed by Vite (e.g., `http://localhost:5173`)

## Usage
- Financial inputs: Add bank accounts, investment accounts, and debts using the “Manage entries” modal.
- Edit entries: Use the pencil icon; press Enter to add/update; delete with the bin icon.
- Tax partner: Toggle “I have a tax partner” to update thresholds.
- Results: The right panel shows taxable base and estimated Box 3 tax, with a detailed breakdown.

## Configuration
- Open the settings (gear icon) in the header.
- Update Box 3 defaults:
	- Year
	- Thresholds: `taxFreeAssetsPerIndividual`, `debtsThresholdPerIndividual`
	- `taxRate` (%)
	- Assumed return rates (%) for `bankBalance`, `investmentAssets`, `debts`
- Reset to defaults via the restore icon.
- Source of defaults: `frontend/src/features/tax-calculator/constants/box3Defaults.js`

## Project Structure
- Frontend app in `frontend/` (React + Vite)
- Key paths:
	- Inputs: `frontend/src/features/tax-calculator/components/TaxInputForm.jsx`
	- Results: `frontend/src/features/tax-calculator/components/TaxResultPanel.jsx`
	- Config menu: `frontend/src/features/tax-calculator/components/ConfigurationMenu.jsx`
	- Calculator hook: `frontend/src/features/tax-calculator/hooks/useBox3Calculator.js`
	- Box 3 logic: `frontend/src/features/tax-calculator/utils/box3.js`
	- Defaults: `frontend/src/features/tax-calculator/constants/box3Defaults.js`

## Accessibility
- Buttons have descriptive `aria-label`s; keyboard support for Enter to add/update.
- Dialogs announce counts and totals; focus is managed to reduce tab friction.

## Privacy & Disclaimer
- No tracking, no uploads — all computation happens locally.
- This tool is for guidance and education only. For personal tax decisions, consult the Belastingdienst or a qualified advisor.