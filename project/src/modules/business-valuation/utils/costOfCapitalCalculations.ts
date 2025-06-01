export const calculateCostOfEquity = (
  riskFreeRate: number,
  marketReturn: number,
  beta: number
): number => {
  // Capital Asset Pricing Model (CAPM)
  const equityRiskPremium = marketReturn - riskFreeRate;
  const costOfEquity = riskFreeRate + (beta * equityRiskPremium);
  return Number(costOfEquity.toFixed(2));
};

export const calculateWACC = (
  costOfEquity: number,
  costOfDebt: number,
  equityValue: number,
  debtValue: number
): number => {
  const totalValue = equityValue + debtValue;
  const equityWeight = equityValue / totalValue;
  const debtWeight = debtValue / totalValue;

  const wacc = (equityWeight * costOfEquity) + (debtWeight * costOfDebt);
  return Number(wacc.toFixed(2));
};