export const calculateNPV = (
  initialInvestment: number,
  cashFlows: number[],
  discountRate: number
): number => {
  const rate = discountRate / 100;
  let npv = -initialInvestment;

  cashFlows.forEach((cf, index) => {
    npv += cf / Math.pow(1 + rate, index + 1);
  });

  return Number(npv.toFixed(2));
};

export const calculateIRR = (
  initialInvestment: number,
  cashFlows: number[]
): number | null => {
  const MAX_ITERATIONS = 1000;
  const PRECISION = 0.00001;
  
  let low = -0.99;
  let high = 9999;
  
  // Check if IRR exists
  let allNegative = true;
  let allPositive = true;
  cashFlows.forEach(cf => {
    if (cf > 0) allNegative = false;
    if (cf < 0) allPositive = false;
  });
  
  if (allNegative || allPositive) return null;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const mid = (low + high) / 2;
    const npv = calculateNPV(initialInvestment, cashFlows, mid * 100);

    if (Math.abs(npv) < PRECISION) {
      return Number((mid * 100).toFixed(2));
    }

    if (npv > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return null;
};