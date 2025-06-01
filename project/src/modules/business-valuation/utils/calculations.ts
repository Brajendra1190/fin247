// Payback Period Types and Calculations
export interface ProcessedCashFlow {
  amount: number;
  isInvestment: boolean;
}

export interface PaybackResult {
  paybackPeriod: number | null;
  cumulativeCashFlows: {
    year: number;
    amount: number;
    cumulative: number;
    isInvestment: boolean;
  }[];
}

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

export const calculateDiscountedPaybackPeriod = (
  initialInvestment: number,
  cashFlows: ProcessedCashFlow[],
  discountRate: number
): PaybackResult => {
  const rate = discountRate / 100;
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
      paybackPeriod = i + 1;
    }
  }

  return {
    paybackPeriod: remainingInvestment > 0 ? null : paybackPeriod,
    cumulativeCashFlows
  };
};