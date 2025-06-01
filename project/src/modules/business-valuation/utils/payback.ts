import type { ProcessedCashFlow, PaybackResult } from './types';

export const calculatePaybackPeriod = (
  initialInvestment: number,
  cashFlows: ProcessedCashFlow[]
): PaybackResult => {
  let remainingInvestment = initialInvestment;
  let paybackPeriod = 0;
  const cumulativeCashFlows = [{
    year: 0,
    amount: -initialInvestment,
    cumulative: -initialInvestment,
    isInvestment: true
  }];
  let cumulativeAmount = -initialInvestment;

  for (let i = 0; i < cashFlows.length; i++) {
    const { amount, isInvestment } = cashFlows[i];
    const effectiveAmount = isInvestment ? -amount : amount;
    cumulativeAmount += effectiveAmount;
    
    cumulativeCashFlows.push({
      year: i + 1,
      amount: effectiveAmount,
      cumulative: cumulativeAmount,
      isInvestment
    });

    if (remainingInvestment > 0) {
      if (isInvestment) {
        remainingInvestment += amount;
      } else {
        remainingInvestment -= amount;
        if (remainingInvestment <= 0) {
          paybackPeriod = i + (remainingInvestment + amount) / amount;
          break;
        }
      }
      paybackPeriod = i + 1;
    }
  }

  return {
    paybackPeriod: remainingInvestment > 0 ? null : paybackPeriod,
    cumulativeCashFlows
  };
};