export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: string;
  lastLoginAt: string;
  defaultCurrency: string;
  settings?: {
    darkMode: boolean;
    emailNotifications: boolean;
  };
}

export interface UserData {
  transactions: any[];
  recurringTransactions: any[];
  budgets: any[];
  categories: any[];
}