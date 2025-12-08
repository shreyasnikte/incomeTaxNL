export function computeBox3Summary(inputs, defaults) {
  const { bankBalance = 0, investmentAssets = 0, debts = 0, hasTaxPartner = false } = inputs ?? {}
  const { thresholds, taxRate, assumedReturnRates } = defaults ?? {}
  const { taxFreeAssetsPerIndividual = 0, debtsThresholdPerIndividual = 0 } = thresholds ?? {}

  // Step 1: taxable returns calculation
  const multiplier = hasTaxPartner ? 2 : 1
  const totalTaxFreeAllowance = multiplier * taxFreeAssetsPerIndividual
  const totalDebtsThreshold = multiplier * debtsThresholdPerIndividual

  const returnsOnBankBalance = bankBalance * (assumedReturnRates?.bankBalance ?? 0)
  const returnsOnInvestmentAssets = investmentAssets * (assumedReturnRates?.investmentAssets ?? 0)
  const debtAfterDeductible = Math.max(0, debts - totalDebtsThreshold)
  const totalCosts = debtAfterDeductible * (assumedReturnRates?.debts ?? 0)
  const totalReturns = returnsOnBankBalance + returnsOnInvestmentAssets
  const taxableReturns = Math.max(0, totalReturns - totalCosts)

  // Step 2: capital yield tax base
  const capitalYieldTaxBase = bankBalance + investmentAssets - debtAfterDeductible

  // Step 3: basis for savings & investments
  const basisForSavingsAndInvestments = Math.max(0, capitalYieldTaxBase - totalTaxFreeAllowance)

  // Step 4: share in capital yield tax base
  const shareInCapitalYieldTaxBase =
    capitalYieldTaxBase > 0 ? basisForSavingsAndInvestments / capitalYieldTaxBase : 0

  // Step 5: income from savings and investments
  const incomeFromSavingsAndInvestments = taxableReturns * shareInCapitalYieldTaxBase

  // Step 6: estimated Box 3 tax
  const estimatedBox3Tax = incomeFromSavingsAndInvestments * (taxRate ?? 0)

  return {
    taxableBase: basisForSavingsAndInvestments,
    estimatedTax: estimatedBox3Tax,
    breakdown: [
      {
        description: 'Total returns',
        amount: totalReturns,
      },
      {
        description: 'Total costs',
        amount: totalCosts,
      },
      {
        description: 'Taxable returns',
        amount: taxableReturns,
      },
      {
        description: 'Capital yield tax base',
        amount: capitalYieldTaxBase,
      },
      {
        description: 'Basis for savings & investments',
        amount: basisForSavingsAndInvestments,
      },
      {
        description: 'Income from savings and investments',
        amount: incomeFromSavingsAndInvestments,
      },
    ],
  }
}