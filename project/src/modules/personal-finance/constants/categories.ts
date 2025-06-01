export const DEFAULT_INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Rental Income',
  'Business',
  'Dividends',
  'Interest',
  'Royalties',
  'Commission',
  'Bonus',
  'Other'
] as const;

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Healthcare',
  'Insurance',
  'Entertainment',
  'Shopping',
  'Education',
  'Debt Payments',
  'Other'
] as const;

export type IncomeCategory = typeof DEFAULT_INCOME_CATEGORIES[number];
export type ExpenseCategory = typeof DEFAULT_EXPENSE_CATEGORIES[number];