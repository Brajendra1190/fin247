import type { ProcessedCashFlow, PaybackResult } from './types';

export const calculateDiscountedPaybackPeriod = (
  initialInvestment: number,
  cashFlows: ProcessedCashFlow[],
  discountRate: number
): PaybackResult => {
  const rate = discountRate / 100;
  let remainingInvestment = initialInvestment;
  let paybackPeriod: number | null = null;
  const cumulativeCashFlows = [{
    year: 0,
    amount: -initialInvestment,
    cumulative: -initialInvestment,
    isInvestment: true
  }];
  let cumulativeAmount = -initialInvestment;

  // Handle single-year cash flow
  if (cashFlows.length === 1) {
    const { amount, isInvestment } = cashFlows[0];
    const discountedAmount = amount / (1 + rate);
    const effectiveAmount = isInvestment ? -discountedAmount : discountedAmount;
    cumulativeAmount += effectiveAmount;

    if (effectiveAmount > 0 && effectiveAmount >= initialInvestment) {
      paybackPeriod = initialInvestment / effectiveAmount;
    }

    cumulativeCashFlows.push({
      year: 1,
      amount: effectiveAmount,
      cumulative: cumulativeAmount,
      isInvestment
    });

    return {
      paybackPeriod,
      cumulativeCashFlows
    };
  }

  // Handle multiple years
  for (let i = 0; i < cashFlows.length; i++) {
    const { amount, isInvestment } = cashFlows[i];
    const discountedAmount = amount / Math.pow(1 + rate, i + 1);
    const effectiveAmount = isInvestment ? -discountedAmount : discountedAmount;
    cumulativeAmount += effectiveAmount;
    
    cumulativeCashFlows.push({
      year: i + 1,
      amount: effectiveAmount,
      cumulative: cumulativeAmount,
      isInvestment
    });

    if (remainingInvestment > 0) {
      if (isInvestment) {
        remainingInvestment += discountedAmount;
      } else {
        remainingInvestment -= discountedAmount;
        if (remainingInvestment <= 0) {
          paybackPeriod = i + (remainingInvestment + discountedAmount) / discountedAmount;
          break;
        }
      }
    }
  }

  return {
    paybackPeriod,
    cumulativeCashFlows
  };
};