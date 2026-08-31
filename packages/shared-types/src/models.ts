import {
  AccountType,
  BudgetPeriod,
  CategoryClassification,
  Currency,
  TransactionSource,
  TransactionType,
} from './enums';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  baseCurrency: Currency;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountModel {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  currency: Currency;
  balance: number;
  initialBalance: number;
  color?: string | null;
  icon?: string | null;
  institutionName?: string | null;
  accountNumberMask?: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryModel {
  id: string;
  userId?: string | null;
  name: string;
  icon: string;
  color: string;
  classification: CategoryClassification;
  isSystem: boolean;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionModel {
  id: string;
  userId: string;
  accountId: string;
  categoryId?: string | null;
  destinationAccountId?: string | null;
  amount: number;
  currency: Currency;
  exchangeRate: number;
  baseAmount: number;
  type: TransactionType;
  merchantName?: string | null;
  notes?: string | null;
  transactionDate: Date;
  source: TransactionSource;
  isRecurring: boolean;
  rawPayload?: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetModel {
  id: string;
  userId: string;
  categoryId: string;
  limitAmount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate?: Date | null;
  spentAmount?: number;
  progressPercentage?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsSummary {
  netWorthInBaseCurrency: number;
  totalIncomeThisMonth: number;
  totalExpensesThisMonth: number;
  netSavingsThisMonth: number;
  savingsRatePercentage: number;
  rule503020: {
    needsAmount: number;
    needsPercentage: number;
    wantsAmount: number;
    wantsPercentage: number;
    savingsAmount: number;
    savingsPercentage: number;
  };
  cashFlowRunwayDays: number;
  currency: Currency;
}
